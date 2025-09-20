import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert,
  Snackbar,
  Chip,
  LinearProgress,
  Container,
  Stack,
  IconButton,
  Grid
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Policy as PolicyIcon,
  AccountCircle as AccountIcon,
  Build as BuildIcon,
  AttachMoney as MoneyIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

interface Template {
  category: string;
  persian_name: string;
  content: string;
  keywords: string[];
}

interface BrandEssentials {
  tone: string;
  personality: string;
  language_style: string;
  brand_values: string[];
  response_guidelines: string[];
}

interface Category {
  id: string;
  name: string;
  persian_name: string;
  description?: string;
  keywords: string[];
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('store_management');
  const [templates, setTemplates] = useState<{ [key: string]: Template }>({});
  const [brandEssentials, setBrandEssentials] = useState<BrandEssentials | null>(null);
  const [editingTemplate, setEditingTemplate] = useState('');
  const [editingBrand, setEditingBrand] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    persian_name: '',
    description: '',
    keywords: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultCategoryIcons: { [key: string]: React.ReactElement } = {
    'store_management': <StoreIcon />,
    'product_listing': <InventoryIcon />,
    'order_management': <AssignmentIcon />,
    'payment_issues': <PaymentIcon />,
    'marketplace_policies': <PolicyIcon />,
    'account_issues': <AccountIcon />,
    'technical_support': <BuildIcon />,
    'commission_revenue': <MoneyIcon />
  };

  const getCategoryIcon = (categoryId: string) => {
    return defaultCategoryIcons[categoryId] || <CategoryIcon />;
  };

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/categories`);
      if (response.ok) {
        const data = await response.json();
        // Convert categories object to array format
        let categoriesArray = [];
        if (Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data.categories && typeof data.categories === 'object') {
          // Convert object to array format
          categoriesArray = Object.entries(data.categories).map(([id, category]: [string, any]) => ({
            id,
            name: id,
            persian_name: category.persian_name,
            description: category.description,
            keywords: category.keywords || [],
            is_default: category.is_default || false
          }));
        }
        
        setCategories(categoriesArray);
        if (categoriesArray.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesArray[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Set fallback default categories
      const fallbackCategories = [
        { id: 'store_management', name: 'store_management', persian_name: 'مدیریت فروشگاه', keywords: [], is_default: true },
        { id: 'product_listing', name: 'product_listing', persian_name: 'لیست محصولات', keywords: [], is_default: true },
        { id: 'order_management', name: 'order_management', persian_name: 'مدیریت سفارش', keywords: [], is_default: true },
        { id: 'payment_issues', name: 'payment_issues', persian_name: 'مشکلات پرداخت', keywords: [], is_default: true }
      ];
      setCategories(fallbackCategories);
      if (!selectedCategory && fallbackCategories.length > 0) {
        setSelectedCategory(fallbackCategories[0].id);
      }
    }
  }, [selectedCategory]);

  const createCategory = async () => {
    if (!newCategory.name || !newCategory.persian_name) return;
    
    setSaveStatus('saving');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: newCategory.name,
          persian_name: newCategory.persian_name,
          description: newCategory.description,
          keywords: newCategory.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
          template_content: `# الگوی پاسخ برای ${newCategory.persian_name}\n\nاین یک الگوی پیش‌فرض است. لطفاً آن را ویرایش کنید.\n\n## راهنمایی‌ها:\n- پاسخ‌ها باید مفید و واضح باشند\n- از زبان محترمانه استفاده کنید\n- مراحل را به صورت شماره‌گذاری شده ارائه دهید`
        })
      });

      if (response.ok) {
        await loadCategories();
        setNewCategory({ name: '', persian_name: '', description: '', keywords: '' });
        setShowAddForm(false);
        setSaveStatus('saved');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Create failed');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!window.confirm('آیا از حذف این موضوع اطمینان دارید؟')) return;
    
    setSaveStatus('saving');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCategories();
        if (selectedCategory === categoryId && Array.isArray(categories) && categories.length > 0) {
          setSelectedCategory(categories[0].id);
        }
        setSaveStatus('saved');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const mockAnalytics = {
    totalQuestions: 2847,
    todayQuestions: 156,
    avgResponseTime: 2.3,
    categoryDistribution: [
      { name: 'مدیریت فروشگاه', count: 687, percentage: 24 },
      { name: 'مشکلات پرداخت', count: 542, percentage: 19 },
      { name: 'لیست محصولات', count: 398, percentage: 14 },
      { name: 'مدیریت سفارش', count: 341, percentage: 12 },
      { name: 'پشتیبانی فنی', count: 312, percentage: 11 },
      { name: 'مشکلات حساب', count: 267, percentage: 9 },
      { name: 'کمیسیون و درآمد', count: 198, percentage: 7 },
      { name: 'سیاست‌های ایمالز', count: 102, percentage: 4 }
    ]
  };

  const loadTemplate = useCallback(async (category: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/templates/${category}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(prev => ({ ...prev, [category]: data }));
        setEditingTemplate(data.content);
      } else {
        // Fallback data for demo
        const categoryData = Array.isArray(categories) ? categories.find(c => c.id === category) : null;
        const fallbackTemplate = {
          category,
          persian_name: categoryData?.persian_name || category,
          content: `# الگوی پاسخ برای ${categoryData?.persian_name || category}\n\nاین یک الگوی نمونه است. شما می‌توانید آن را ویرایش کنید.\n\n## راهنمایی‌ها:\n- پاسخ‌ها باید مفید و واضح باشند\n- از زبان محترمانه استفاده کنید\n- مراحل را به صورت شماره‌گذاری شده ارائه دهید`,
          keywords: categoryData?.keywords || ['نمونه', 'تست']
        };
        setTemplates(prev => ({ ...prev, [category]: fallbackTemplate }));
        setEditingTemplate(fallbackTemplate.content);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }, [categories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedCategory) {
      loadTemplate(selectedCategory);
    }
  }, [selectedCategory, loadTemplate]);

  useEffect(() => {
    if (activeTab === 1) {
      loadBrandEssentials();
    }
  }, [activeTab]);

  const loadBrandEssentials = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/brand-essentials`);
      if (response.ok) {
        const data = await response.json();
        setBrandEssentials(data.brand_essentials);
        setEditingBrand(JSON.stringify(data.brand_essentials, null, 2));
      } else {
        // Fallback data for demo
        const fallbackBrand = {
          tone: "دوستانه و حرفه‌ای",
          personality: "کمک‌کننده، صبور، و قابل اعتماد",
          language_style: "فارسی رسمی اما صمیمی",
          brand_values: ["کیفیت", "سرعت", "اعتماد", "نوآوری"],
          response_guidelines: ["همیشه با سلام شروع کن", "راه‌حل عملی ارائه ده", "اگر نمی‌دانی صادقانه بگو"]
        };
        setBrandEssentials(fallbackBrand);
        setEditingBrand(JSON.stringify(fallbackBrand, null, 2));
      }
    } catch (error) {
      console.error('Error loading brand essentials:', error);
    }
  };

  const saveTemplate = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/templates/${selectedCategory}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingTemplate })
      });

      if (response.ok) {
        setSaveStatus('saved');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveBrandEssentials = async () => {
    setSaveStatus('saving');
    try {
      const essentials = JSON.parse(editingBrand);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir/api'}/brand-essentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essentials })
      });

      if (response.ok) {
        setBrandEssentials(essentials);
        setSaveStatus('saved');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving brand essentials:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const resetTemplate = () => {
    if (templates[selectedCategory]) {
      setEditingTemplate(templates[selectedCategory].content);
    }
  };

  const resetBrandEssentials = () => {
    if (brandEssentials) {
      setEditingBrand(JSON.stringify(brandEssentials, null, 2));
    }
  };

  return (
    <Container maxWidth="xl">
      <Card elevation={3}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)', 
          color: 'white', 
          p: 3 
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            پنل مدیریت چت‌بات
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            کنترل کامل روی رفتار و پاسخ‌های چت‌بات
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="fullWidth">
            <Tab 
              label="مدیریت الگوها" 
              icon={<DescriptionIcon />} 
              iconPosition="start"
              sx={{ fontWeight: 'bold' }} 
            />
            <Tab 
              label="مدیریت موضوعات (سوال و جواب)" 
              icon={<CategoryIcon />} 
              iconPosition="start"
              sx={{ fontWeight: 'bold' }} 
            />
            <Tab 
              label="صدای برند" 
              icon={<PaletteIcon />} 
              iconPosition="start"
              sx={{ fontWeight: 'bold' }} 
            />
            <Tab 
              label="آمار و گزارشات" 
              icon={<AnalyticsIcon />} 
              iconPosition="start"
              sx={{ fontWeight: 'bold' }} 
            />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Templates Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Categories Sidebar */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    موضوعات:
                  </Typography>
                  <List dense>
                    {Array.isArray(categories) && categories.map((category) => (
                      <ListItem key={category.id} disablePadding>
                        <ListItemButton
                          selected={selectedCategory === category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                              bgcolor: 'primary.light',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.main'
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                            {getCategoryIcon(category.id)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={category.persian_name} 
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="caption" fontWeight="bold">
                      💡 نکات مهم:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.75rem' }}>
                      <li>هر تغییر فوراً اعمال می‌شود</li>
                      <li>از دستورالعمل‌های واضح استفاده کنید</li>
                      <li>پاسخ‌ها مفصل و مفید باشند</li>
                    </Box>
                  </Alert>
                </Paper>
              </Grid>

              {/* Editor */}
              <Grid size={{ xs: 12, md: 9 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      ویرایش الگوی: {Array.isArray(categories) ? categories.find(c => c.id === selectedCategory)?.persian_name : selectedCategory}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={resetTemplate} color="default">
                        <RefreshIcon />
                      </IconButton>
                      <Button
                        onClick={saveTemplate}
                        disabled={saveStatus === 'saving'}
                        variant="contained"
                        startIcon={saveStatus === 'saving' ? <LinearProgress /> : <SaveIcon />}
                        sx={{ minWidth: 140 }}
                      >
                        {saveStatus === 'saving' ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                      </Button>
                    </Stack>
                  </Stack>

                  <TextField
                    fullWidth
                    multiline
                    rows={16}
                    value={editingTemplate}
                    onChange={(e) => setEditingTemplate(e.target.value)}
                    placeholder="الگوی پاسخ را اینجا وارد کنید..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.6
                      }
                    }}
                  />

                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      پیش‌نمایش تأثیر:
                    </Typography>
                    <Typography variant="body2">
                      با تغییر این الگو، تمام پاسخ‌های مربوط به موضوع "
                      {Array.isArray(categories) ? categories.find(c => c.id === selectedCategory)?.persian_name : selectedCategory}
                      " به شکل جدید نمایش داده خواهند شد.
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Category Management Tab */}
          {activeTab === 1 && (
            <Box>
              <Grid container spacing={3}>
                {/* Category List */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper elevation={1} sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                      <Typography variant="h6" fontWeight="bold">
                        مدیریت موضوعات (سوال و جواب)
                      </Typography>
                      <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="primary"
                      >
                        افزودن موضوع جدید
                      </Button>
                    </Stack>

                    {/* Add Category Form */}
                    {showAddForm && (
                      <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" gutterBottom>
                          افزودن موضوع جدید:
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="نام انگلیسی"
                              value={newCategory.name}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="shipping_logistics"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="نام فارسی"
                              value={newCategory.persian_name}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, persian_name: e.target.value }))}
                              placeholder="لجستیک و ارسال"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="توضیحات (اختیاری)"
                              value={newCategory.description}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="مسائل مربوط به ارسال، حمل و نقل، و تحویل کالا"
                              variant="outlined"
                              size="small"
                              multiline
                              rows={2}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="کلمات کلیدی (با کاما جدا کنید)"
                              value={newCategory.keywords}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, keywords: e.target.value }))}
                              placeholder="ارسال، تحویل، پست، باربری، حمل"
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2}>
                              <Button
                                onClick={createCategory}
                                disabled={saveStatus === 'saving' || !newCategory.name || !newCategory.persian_name}
                                variant="contained"
                                startIcon={<SaveIcon />}
                              >
                                {saveStatus === 'saving' ? 'در حال ذخیره...' : 'ایجاد موضوع'}
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowAddForm(false);
                                  setNewCategory({ name: '', persian_name: '', description: '', keywords: '' });
                                }}
                                variant="outlined"
                              >
                                انصراف
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}


                    {/* Category List */}
                    <Stack spacing={2}>
                      {!Array.isArray(categories) || categories.length === 0 ? (
                        <Alert severity="warning">
                          <Typography variant="body2">
                            هیچ موضوع یافت نشد. در حال بارگذاری...
                          </Typography>
                        </Alert>
                      ) : (
                        categories.map((category) => (
                        <Card key={category.id} variant="outlined">
                          <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {getCategoryIcon(category.id)}
                                <Box>
                                  <Typography variant="h6" fontWeight="bold">
                                    {category.persian_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {category.name}
                                  </Typography>
                                  {category.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                      {category.description}
                                    </Typography>
                                  )}
                                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    {Array.isArray(category.keywords) && category.keywords.map((keyword, index) => (
                                      <Chip key={index} label={keyword} size="small" variant="outlined" />
                                    ))}
                                  </Stack>
                                </Box>
                              </Stack>
                              <Stack direction="row" spacing={1}>
                                {category.is_default && (
                                  <Chip label="پیش‌فرض" size="small" color="primary" />
                                )}
                                {!category.is_default && (
                                  <IconButton
                                    onClick={() => deleteCategory(category.id)}
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                        ))
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                {/* Category Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      راهنمای موضوع‌ها
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        💡 نکات مهم:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                        <li>موضوع‌های پیش‌فرض قابل حذف نیستند</li>
                        <li>هر موضوع جدید فایل الگوی مخصوص خود را دارد</li>
                        <li>کلمات کلیدی برای تشخیص خودکار استفاده می‌شوند</li>
                        <li>تغییرات فوراً در سیستم طبقه‌بندی اعمال می‌شوند</li>
                      </Box>
                    </Alert>

                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">
                        ✅ مزایای موضوع پویا:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                        <li>انعطاف‌پذیری کامل در اضافه کردن موضوعات جدید</li>
                        <li>بهبود دقت طبقه‌بندی با کلمات کلیدی</li>
                        <li>مدیریت ساده الگوها برای هر موضوع</li>
                        <li>قابلیت تطبیق با نیازهای کسب‌وکار</li>
                      </Box>
                    </Alert>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                      آمار موضوع‌ها:
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">کل موضوع‌ها:</Typography>
                        <Typography variant="body2" fontWeight="bold">{Array.isArray(categories) ? categories.length : 0}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">موضوع‌های پیش‌فرض:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {Array.isArray(categories) ? categories.filter(c => c.is_default).length : 0}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">موضوع‌های سفارشی:</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {Array.isArray(categories) ? categories.filter(c => !c.is_default).length : 0}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Brand Voice Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      تنظیمات صدای برند:
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={resetBrandEssentials} color="default">
                        <RefreshIcon />
                      </IconButton>
                      <Button
                        onClick={saveBrandEssentials}
                        disabled={saveStatus === 'saving'}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        color="secondary"
                      >
                        {saveStatus === 'saving' ? 'در حال ذخیره...' : 'ذخیره صدای برند'}
                      </Button>
                    </Stack>
                  </Stack>
                  
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      ⚠️ توجه مهم:
                    </Typography>
                    <Typography variant="body2">
                      تغییرات صدای برند بر <strong>تمام موضوع‌ها</strong> تأثیر می‌گذارد
                      و شخصیت کلی چت‌بات را تعیین می‌کند.
                    </Typography>
                  </Alert>

                  <TextField
                    fullWidth
                    multiline
                    rows={20}
                    value={editingBrand}
                    onChange={(e) => setEditingBrand(e.target.value)}
                    placeholder="تنظیمات صدای برند در فرمت JSON..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace',
                        fontSize: '0.85rem'
                      }
                    }}
                  />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    پیش‌نمایش تأثیر:
                  </Typography>
                  
                  {brandEssentials && (
                    <Stack spacing={2}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary">
                            تون صحبت:
                          </Typography>
                          <Typography variant="body2">
                            {brandEssentials.tone}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary">
                            شخصیت:
                          </Typography>
                          <Typography variant="body2">
                            {brandEssentials.personality}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary">
                            سبک زبان:
                          </Typography>
                          <Typography variant="body2">
                            {brandEssentials.language_style}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary">
                            ارزش‌های برند:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                            {brandEssentials.brand_values.map((value, index) => (
                              <Chip key={index} label={value} size="small" color="primary" variant="outlined" />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Stack>
                  )}

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      🌟 تأثیر بر کل سیستم:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                      <li>تمام پاسخ‌ها با این تون تولید می‌شوند</li>
                      <li>شخصیت چت‌بات در همه گفتگوها یکسان است</li>
                      <li>ارزش‌های برند در محتوا منعکس می‌شود</li>
                    </Box>
                  </Alert>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Analytics Tab */}
          {activeTab === 3 && (
            <Box>
              {/* Stats Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AnalyticsIcon sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {mockAnalytics.totalQuestions.toLocaleString('fa-IR')}
                          </Typography>
                          <Typography variant="body2">
                            کل سوالات پاسخ داده شده
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h2">⚡</Typography>
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {mockAnalytics.avgResponseTime} ثانیه
                          </Typography>
                          <Typography variant="body2">
                            میانگین زمان پاسخ
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h2">📊</Typography>
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {mockAnalytics.todayQuestions}
                          </Typography>
                          <Typography variant="body2">
                            سوالات امروز
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Category Distribution */}
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  توزیع سوالات بر اساس موضوع:
                </Typography>
                <Stack spacing={2}>
                  {mockAnalytics.categoryDistribution.map((category, index) => (
                    <Box key={index}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.count} ({category.percentage}%)
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={category.percentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* Insights */}
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                  💡 بینش‌های کلیدی:
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" fontWeight="medium">
                      بیشترین سوالات:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      مدیریت فروشگاه و مشکلات پرداخت بیشترین سهم را دارند
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" fontWeight="medium">
                      فرصت بهبود:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      الگوهای مربوط به پرداخت و فروشگاه را بهینه کنید
                    </Typography>
                  </Grid>
                </Grid>
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for save confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          تغییرات با موفقیت ذخیره شد! ✅
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;