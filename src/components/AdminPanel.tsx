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
import categoryService, { Category as ApiCategory } from '../services/categoryService';

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

// Using ApiCategory type from service
type Category = ApiCategory;

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('store_management');
  const [templates, setTemplates] = useState<{ [key: string]: Template }>({});
  const [brandEssentials, setBrandEssentials] = useState<BrandEssentials | null>(null);
  const [editingTemplate, setEditingTemplate] = useState('');
  const [editingInstructions, setEditingInstructions] = useState('');
  const [editingQA, setEditingQA] = useState('');
  const [editingBrand, setEditingBrand] = useState('');
  const [contentTab, setContentTab] = useState(0); // 0: Instructions, 1: QA
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success');
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    persian_name: '',
    description: ''
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
      const data = await categoryService.getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Set fallback default categories
      const fallbackCategories: Category[] = [
        { id: 'store_management', name: 'store_management', persian_name: 'مدیریت فروشگاه', keywords: [], is_default: true, is_active: true },
        { id: 'product_listing', name: 'product_listing', persian_name: 'لیست محصولات', keywords: [], is_default: true, is_active: true },
        { id: 'order_management', name: 'order_management', persian_name: 'مدیریت سفارش', keywords: [], is_default: true, is_active: true },
        { id: 'payment_issues', name: 'payment_issues', persian_name: 'مشکلات پرداخت', keywords: [], is_default: true, is_active: true }
      ];
      setCategories(fallbackCategories);
      if (!selectedCategory && fallbackCategories.length > 0) {
        setSelectedCategory(fallbackCategories[0].id);
      }
    }
  }, [selectedCategory]);

  const createCategory = async () => {
    if (!newCategory.persian_name.trim()) {
      setSnackbarMessage('نام فارسی موضوع الزامی است!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    setSaveStatus('saving');
    try {
      const createdCategory = await categoryService.createCategory({
        persian_name: newCategory.persian_name,
        description: newCategory.description || undefined
      });
      
      // Add to local state
      setCategories(prev => [...prev, createdCategory]);
      
      // Reset form
      setNewCategory({ persian_name: '', description: '' });
      setShowAddForm(false);
      setSaveStatus('saved');
      setSnackbarMessage(`موضوع "${newCategory.persian_name}" با موفقیت ایجاد شد! ✅`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error creating category:', error);
      setSaveStatus('error');
      setSnackbarMessage('خطا در ایجاد موضوع! لطفاً دوباره تلاش کنید.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!window.confirm('آیا از حذف این موضوع اطمینان دارید؟')) return;
    
    setSaveStatus('saving');
    try {
      // For now, just remove from local state - demo functionality
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      if (selectedCategory === categoryId && Array.isArray(categories) && categories.length > 0) {
        const remaining = categories.filter(cat => cat.id !== categoryId);
        if (remaining.length > 0) {
          setSelectedCategory(remaining[0].id);
        }
      }
      setSaveStatus('saved');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${category}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const template = {
          category,
          persian_name: data.persian_name,
          content: `${data.instructions}\n\n${data.qa_content}`,
          keywords: data.keywords
        };
        setTemplates(prev => ({ ...prev, [category]: template }));
        setEditingTemplate(template.content);
        setEditingInstructions(data.instructions || '');
        setEditingQA(data.qa_content || '');
      } else {
        // Fallback data for demo
        const categoryData = Array.isArray(categories) ? categories.find(c => c.id === category) : null;
        const fallbackInstructions = `# دستورالعمل‌های ${categoryData?.persian_name || category}\n\nاین بخش شامل دستورالعمل‌های کلی برای پاسخ‌دهی به ${categoryData?.persian_name || category} است.\n\n## رهنمودهای اصلی:\n- پاسخ‌ها باید واضح و مفید باشند\n- از زبان محترمانه و حرفه‌ای استفاده کنید\n- مراحل را به صورت مرحله‌بندی شده ارائه دهید`;
        const fallbackQA = `# سوالات متداول ${categoryData?.persian_name || category}\n\n## سوال ۱: چگونه...؟\nپاسخ: برای این کار...\n\n## سوال ۲: آیا امکان...؟\nپاسخ: بله، می‌توانید...\n\n## سوال ۳: چرا...؟\nپاسخ: این مسئله به دلیل...`;
        
        const fallbackTemplate = {
          category,
          persian_name: categoryData?.persian_name || category,
          content: `${fallbackInstructions}\n\n${fallbackQA}`,
          keywords: categoryData?.keywords || ['نمونه', 'تست']
        };
        setTemplates(prev => ({ ...prev, [category]: fallbackTemplate }));
        setEditingTemplate(fallbackTemplate.content);
        setEditingInstructions(fallbackInstructions);
        setEditingQA(fallbackQA);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }, [categories]);

  const loadCategoryInstructions = useCallback(async (category: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${category}/instructions`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEditingInstructions(data.instructions || '');
      }
    } catch (error) {
      console.error('Error loading instructions:', error);
    }
  }, []);

  const loadCategoryQA = useCallback(async (category: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${category}/qa`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEditingQA(data.qa_content || '');
      }
    } catch (error) {
      console.error('Error loading QA content:', error);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedCategory) {
      loadTemplate(selectedCategory);
      // Reset content tab when switching categories
      setContentTab(0);
    }
  }, [selectedCategory, loadTemplate]);

  useEffect(() => {
    if (activeTab === 1) {
      loadBrandEssentials();
    }
  }, [activeTab]);

  const loadBrandEssentials = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/brand`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const brandEssentials = {
          tone: data.tone,
          personality: data.personality,
          language_style: data.communication_style,
          brand_values: [],
          response_guidelines: []
        };
        setBrandEssentials(brandEssentials);
        setEditingBrand(JSON.stringify(brandEssentials, null, 2));
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

  const saveInstructions = async () => {
    if (!editingInstructions.trim()) {
      setSnackbarMessage('دستورالعمل‌ها نمی‌تواند خالی باشد!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setSaveStatus('saving');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${selectedCategory}/instructions`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json' 
        },
        body: editingInstructions
      });

      if (response.ok) {
        setSaveStatus('saved');
        setSnackbarMessage('دستورالعمل‌ها با موفقیت ذخیره شد! ✅');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving instructions:', error);
      setSaveStatus('error');
      setSnackbarMessage('خطا در ذخیره دستورالعمل‌ها! لطفاً دوباره تلاش کنید.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveQA = async () => {
    if (!editingQA.trim()) {
      setSnackbarMessage('سوالات متداول نمی‌تواند خالی باشد!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    setSaveStatus('saving');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${selectedCategory}/qa`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json' 
        },
        body: editingQA
      });

      if (response.ok) {
        setSaveStatus('saved');
        setSnackbarMessage('سوالات متداول با موفقیت ذخیره شد! ✅');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving QA:', error);
      setSaveStatus('error');
      setSnackbarMessage('خطا در ذخیره سوالات متداول! لطفاً دوباره تلاش کنید.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const saveTemplate = async () => {
    setSaveStatus('saving');
    try {
      // Split content into instructions and QA sections for the new API
      const sections = editingTemplate.split('\n\n');
      const instructions = sections.slice(0, Math.ceil(sections.length / 2)).join('\n\n');
      const qaContent = sections.slice(Math.ceil(sections.length / 2)).join('\n\n');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories/${selectedCategory}/instructions`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ content: instructions })
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
      // For demo purposes, just simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const essentials = JSON.parse(editingBrand);
      setBrandEssentials(essentials);
      setSaveStatus('saved');
      setSnackbarOpen(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
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

  const resetInstructions = () => {
    loadCategoryInstructions(selectedCategory);
  };

  const resetQA = () => {
    loadCategoryQA(selectedCategory);
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
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    ویرایش الگوی: {Array.isArray(categories) ? categories.find(c => c.id === selectedCategory)?.persian_name : selectedCategory}
                  </Typography>

                  {/* Content Type Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={contentTab} onChange={(e, newValue) => setContentTab(newValue)} variant="fullWidth">
                      <Tab 
                        label="دستورالعمل‌ها" 
                        icon={<DescriptionIcon />} 
                        iconPosition="start"
                        sx={{ fontWeight: 'bold' }} 
                      />
                      <Tab 
                        label="سوالات متداول" 
                        icon={<AssignmentIcon />} 
                        iconPosition="start"
                        sx={{ fontWeight: 'bold' }} 
                      />
                    </Tabs>
                  </Box>

                  {/* Instructions Tab */}
                  {contentTab === 0 && (
                    <Box>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          📋 دستورالعمل‌های پاسخ‌دهی
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={resetInstructions} color="default" size="small">
                            <RefreshIcon />
                          </IconButton>
                          <Button
                            onClick={saveInstructions}
                            disabled={saveStatus === 'saving' || !editingInstructions.trim()}
                            variant="contained"
                            startIcon={saveStatus === 'saving' ? <LinearProgress /> : <SaveIcon />}
                            size="small"
                            sx={{ minWidth: 140 }}
                          >
                            {saveStatus === 'saving' ? 'در حال ذخیره...' : 'ذخیره دستورالعمل‌ها'}
                          </Button>
                        </Stack>
                      </Stack>

                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          💡 راهنمای دستورالعمل‌ها:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                          <li>رهنمودهای کلی برای نحوه پاسخ‌دهی</li>
                          <li>سبک و تون مکالمه</li>
                          <li>نکات فنی و تخصصی</li>
                          <li>محدودیت‌ها و قوانین</li>
                        </Box>
                      </Alert>

                      <TextField
                        fullWidth
                        multiline
                        rows={16}
                        value={editingInstructions}
                        onChange={(e) => setEditingInstructions(e.target.value)}
                        placeholder="دستورالعمل‌های پاسخ‌دهی را اینجا وارد کنید..."
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            lineHeight: 1.6
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* QA Tab */}
                  {contentTab === 1 && (
                    <Box>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold" color="secondary">
                          ❓ سوالات و پاسخ‌های متداول
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <IconButton onClick={resetQA} color="default" size="small">
                            <RefreshIcon />
                          </IconButton>
                          <Button
                            onClick={saveQA}
                            disabled={saveStatus === 'saving' || !editingQA.trim()}
                            variant="contained"
                            color="secondary"
                            startIcon={saveStatus === 'saving' ? <LinearProgress /> : <SaveIcon />}
                            size="small"
                            sx={{ minWidth: 140 }}
                          >
                            {saveStatus === 'saving' ? 'در حال ذخیره...' : 'ذخیره سوالات متداول'}
                          </Button>
                        </Stack>
                      </Stack>

                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                          🎯 راهنمای سوالات متداول:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem' }}>
                          <li>سوالات رایج کاربران در این موضوع</li>
                          <li>پاسخ‌های استاندارد و آماده</li>
                          <li>مثال‌های عملی و کاربردی</li>
                          <li>راه‌حل‌های گام‌به‌گام</li>
                        </Box>
                      </Alert>

                      <TextField
                        fullWidth
                        multiline
                        rows={16}
                        value={editingQA}
                        onChange={(e) => setEditingQA(e.target.value)}
                        placeholder="سوالات و پاسخ‌های متداول را اینجا وارد کنید..."
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            lineHeight: 1.6
                          }
                        }}
                      />
                    </Box>
                  )}

                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      🔄 پیش‌نمایش تأثیر:
                    </Typography>
                    <Typography variant="body2">
                      {contentTab === 0 
                        ? `دستورالعمل‌های ${Array.isArray(categories) ? categories.find(c => c.id === selectedCategory)?.persian_name : selectedCategory} بر تمام پاسخ‌های این موضوع تأثیر می‌گذارد.`
                        : `سوالات متداول ${Array.isArray(categories) ? categories.find(c => c.id === selectedCategory)?.persian_name : selectedCategory} برای پاسخ‌دهی دقیق‌تر استفاده می‌شود.`
                      }
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
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            💡 پس از ایجاد موضوع، دستورالعمل‌ها و سوالات متداول پیش‌فرض به صورت خودکار تولید می‌شوند.
                          </Typography>
                        </Alert>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="نام موضوع (فارسی) *"
                              value={newCategory.persian_name}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, persian_name: e.target.value }))}
                              placeholder="مثال: لجستیک و ارسال"
                              variant="outlined"
                              size="small"
                              required
                              error={!newCategory.persian_name.trim() && newCategory.persian_name.length > 0}
                              helperText={!newCategory.persian_name.trim() && newCategory.persian_name.length > 0 ? 'نام موضوع الزامی است' : ''}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <TextField
                              fullWidth
                              label="توضیحات (اختیاری)"
                              value={newCategory.description}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="مثال: مسائل مربوط به ارسال، حمل و نقل، و تحویل کالا"
                              variant="outlined"
                              size="small"
                              multiline
                              rows={3}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Stack direction="row" spacing={2}>
                              <Button
                                onClick={createCategory}
                                disabled={saveStatus === 'saving' || !newCategory.persian_name.trim()}
                                variant="contained"
                                startIcon={<SaveIcon />}
                              >
                                {saveStatus === 'saving' ? 'در حال ایجاد...' : 'ایجاد موضوع'}
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowAddForm(false);
                                  setNewCategory({ persian_name: '', description: '' });
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
                        <li>هر موضوع جدید دستورالعمل و سوالات متداول پیش‌فرض دارد</li>
                        <li>شناسه موضوع به صورت خودکار از نام فارسی تولید می‌شود</li>
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
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage || 'تغییرات با موفقیت ذخیره شد! ✅'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;