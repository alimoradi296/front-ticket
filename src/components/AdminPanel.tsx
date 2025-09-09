import React, { useState, useEffect } from 'react';
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
  Divider,
  Container,
  Stack,
  IconButton,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
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
  Description as DescriptionIcon
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

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('store_management');
  const [templates, setTemplates] = useState<{ [key: string]: Template }>({});
  const [brandEssentials, setBrandEssentials] = useState<BrandEssentials | null>(null);
  const [editingTemplate, setEditingTemplate] = useState('');
  const [editingBrand, setEditingBrand] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const categories = [
    { key: 'store_management', name: 'مدیریت فروشگاه', icon: <StoreIcon /> },
    { key: 'product_listing', name: 'لیست محصولات', icon: <InventoryIcon /> },
    { key: 'order_management', name: 'مدیریت سفارش', icon: <AssignmentIcon /> },
    { key: 'payment_issues', name: 'مشکلات پرداخت', icon: <PaymentIcon /> },
    { key: 'marketplace_policies', name: 'سیاست‌های مارکت‌پلیس', icon: <PolicyIcon /> },
    { key: 'account_issues', name: 'مشکلات حساب', icon: <AccountIcon /> },
    { key: 'technical_support', name: 'پشتیبانی فنی', icon: <BuildIcon /> },
    { key: 'commission_revenue', name: 'کمیسیون و درآمد', icon: <MoneyIcon /> }
  ];

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
      { name: 'سیاست‌های مارکت‌پلیس', count: 102, percentage: 4 }
    ]
  };

  const loadTemplate = async (category: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/templates/${category}`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(prev => ({ ...prev, [category]: data }));
        setEditingTemplate(data.content);
      } else {
        // Fallback data for demo
        const fallbackTemplate = {
          category,
          persian_name: categories.find(c => c.key === category)?.name || category,
          content: `# الگوی پاسخ برای ${categories.find(c => c.key === category)?.name}\n\nاین یک الگوی نمونه است. شما می‌توانید آن را ویرایش کنید.\n\n## راهنمایی‌ها:\n- پاسخ‌ها باید مفید و واضح باشند\n- از زبان محترمانه استفاده کنید\n- مراحل را به صورت شماره‌گذاری شده ارائه دهید`,
          keywords: ['نمونه', 'تست']
        };
        setTemplates(prev => ({ ...prev, [category]: fallbackTemplate }));
        setEditingTemplate(fallbackTemplate.content);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  useEffect(() => {
    loadTemplate(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (activeTab === 1) {
      loadBrandEssentials();
    }
  }, [activeTab]);

  const loadBrandEssentials = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/brand-essentials');
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
      const response = await fetch(`http://localhost:8000/api/templates/${selectedCategory}`, {
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
      const response = await fetch('http://localhost:8000/api/brand-essentials', {
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
                    دسته‌بندی‌ها:
                  </Typography>
                  <List dense>
                    {categories.map((category) => (
                      <ListItem key={category.key} disablePadding>
                        <ListItemButton
                          selected={selectedCategory === category.key}
                          onClick={() => setSelectedCategory(category.key)}
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
                            {category.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={category.name} 
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
                      ویرایش الگوی: {categories.find(c => c.key === selectedCategory)?.name}
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
                      با تغییر این الگو، تمام پاسخ‌های مربوط به دسته‌بندی "
                      {categories.find(c => c.key === selectedCategory)?.name}
                      " به شکل جدید نمایش داده خواهند شد.
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Brand Voice Tab */}
          {activeTab === 1 && (
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
                      تغییرات صدای برند بر <strong>تمام دسته‌بندی‌ها</strong> تأثیر می‌گذارد
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
          {activeTab === 2 && (
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
                  توزیع سوالات بر اساس دسته‌بندی:
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