import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Alert,
  Container,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Speed as SpeedIcon,
  AccessTime as TimeIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  LinearScale as ScaleIcon,
  IntegrationInstructions as IntegrationIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';

const SystemExplanation: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              سیستم چت‌بات هوشمند فروشگاه فارسی
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              راه‌حل جامع برای خودکارسازی پشتیبانی مشتریان در مارکت‌پلیس‌های فارسی
            </Typography>
          </Box>

          {/* Value Proposition */}
          <Paper 
            elevation={2} 
            sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
              color: 'white', 
              p: 4, 
              mb: 6,
              borderRadius: 3
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
              چرا این سیستم؟
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 4 }} textAlign="center">
                <TrendingDownIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h3" fontWeight="bold">
                  70-80%
                </Typography>
                <Typography variant="body1">
                  کاهش تیکت‌های پشتیبانی
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} textAlign="center">
                <TimeIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h3" fontWeight="bold">
                  24/7
                </Typography>
                <Typography variant="body1">
                  پاسخگویی فوری
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} textAlign="center">
                <SpeedIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h3" fontWeight="bold">
                  {'<3'} ثانیه
                </Typography>
                <Typography variant="body1">
                  زمان پاسخ
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* How it works */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
              نحوه کارکرد سیستم
            </Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  {[
                    {
                      step: 1,
                      title: 'دریافت پیام فارسی',
                      description: 'مشتری سوال خود را به زبان فارسی می‌پرسد',
                      color: '#1976d2'
                    },
                    {
                      step: 2,
                      title: 'تشخیص دسته‌بندی',
                      description: 'هوش مصنوعی موضوع سوال را از 8 دسته تشخیص می‌دهد',
                      color: '#2e7d32'
                    },
                    {
                      step: 3,
                      title: 'تولید پاسخ شخصی',
                      description: 'بر اساس الگوهای شما و صدای برند پاسخ تولید می‌شود',
                      color: '#ed6c02'
                    },
                    {
                      step: 4,
                      title: 'ارسال پاسخ فوری',
                      description: 'پاسخ کامل و مفید در کمتر از 3 ثانیه ارسال می‌شود',
                      color: '#9c27b0'
                    }
                  ].map((item) => (
                    <Paper key={item.step} elevation={1} sx={{ p: 3, borderLeft: `4px solid ${item.color}` }}>
                      <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: item.color,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}
                        >
                          {item.step}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Grid>

              {/* Categories */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    8 دسته‌بندی پشتیبانی:
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      { icon: '🏪', name: 'مدیریت فروشگاه' },
                      { icon: '📦', name: 'لیست محصولات' },
                      { icon: '📋', name: 'مدیریت سفارش' },
                      { icon: '💳', name: 'مشکلات پرداخت' },
                      { icon: '📜', name: 'سیاست‌های مارکت‌پلیس' },
                      { icon: '👤', name: 'مشکلات حساب' },
                      { icon: '🔧', name: 'پشتیبانی فنی' },
                      { icon: '💰', name: 'کمیسیون و درآمد' }
                    ].map((category, index) => (
                      <Chip
                        key={index}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </Box>
                        }
                        variant="outlined"
                        sx={{ 
                          justifyContent: 'flex-start',
                          py: 2,
                          px: 2,
                          height: 'auto',
                          fontSize: '0.9rem'
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Control Panel */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
              کنترل کامل در دست شما
            </Typography>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%', bgcolor: '#e8f5e8' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <SettingsIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                      <Typography variant="h5" fontWeight="bold" color="#2e7d32">
                        ویرایش آسان الگوها
                      </Typography>
                    </Stack>
                    <List dense>
                      {[
                        'بدون نیاز به دانش فنی',
                        'تغییر فوری محتوا',
                        'پیش‌نمایش زنده تغییرات',
                        'کنترل کامل روی پاسخ‌ها'
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon sx={{ fontSize: 20, color: '#2e7d32' }} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <PaletteIcon sx={{ fontSize: 40, color: '#9c27b0' }} />
                      <Typography variant="h5" fontWeight="bold" color="#9c27b0">
                        مدیریت صدای برند
                      </Typography>
                    </Stack>
                    <List dense>
                      {[
                        'تعیین شخصیت چت‌بات',
                        'تنظیم تون صحبت',
                        'سازگاری با فرهنگ برند',
                        'تأثیر بر همه پاسخ‌ها'
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon sx={{ fontSize: 20, color: '#9c27b0' }} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* API Service Value */}
          <Paper elevation={2} sx={{ bgcolor: '#1a1a1a', color: 'white', p: 4, mb: 6, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
              چرا سرویس API؟
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {[
                { icon: <IntegrationIcon />, title: 'انطباق‌پذیری', desc: 'ادغام با هر پلتفرم' },
                { icon: <ScaleIcon />, title: 'مقیاس‌پذیری', desc: 'هزاران کاربر همزمان' },
                { icon: <SecurityIcon />, title: 'امنیت', desc: 'داده‌ها در سرور شما' },
                { icon: <ArchitectureIcon />, title: 'سفارشی‌سازی', desc: 'تغییر بر اساس نیاز' }
              ].map((item, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }} textAlign="center">
                  <Box sx={{ fontSize: 40, mb: 1, color: '#64b5f6' }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="#64b5f6">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {item.desc}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Next Steps */}
          <Alert 
            severity="info" 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: '#e3f2fd',
              '& .MuiAlert-icon': { fontSize: 30 }
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🚀 برای شروع تست:
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" fontWeight="bold">
                  نمای کاربر:
                </Typography>
                <Typography variant="body2">
                  تجربه مشتری نهایی را ببینید
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" fontWeight="bold">
                  پنل مدیریت:
                </Typography>
                <Typography variant="body2">
                  قدرت کنترل سیستم را احساس کنید
                </Typography>
              </Grid>
            </Grid>
          </Alert>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SystemExplanation;