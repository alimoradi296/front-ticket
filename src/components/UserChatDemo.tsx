import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Paper,
  LinearProgress,
  Alert,
  Divider,
  Stack,
  Container
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Circle as CircleIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: string;
  processingTime?: number;
}

interface Category {
  id: string;
  name: string;
  persian_name: string;
  description?: string;
  keywords: string[];
  is_default: boolean;
}

const UserChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'چطور محصولم را در ایمالز لیست کنم؟',
    'مشکل در پرداخت دارم، چه کار کنم؟',
    'کمیسیون ایمالز چقدر است؟',
    'چطور سفارشاتم را مدیریت کنم؟',
    'مشکل فنی در حسابم دارم',
    'چطور درآمدم را محاسبه کنم؟',
    'سیاست‌های بازگشت کالا چیه؟',
    'چطور فروشگاهم را بهینه کنم؟'
  ];

  const loadCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/categories`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Backend returns array directly now
        setCategories(data);
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
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string = inputText) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const startTime = Date.now();
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir'}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || 'demo_api_key'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          merchant_id: 'demo_founder',
          conversation_id: undefined // Let server generate session ID
        })
      });

      if (response.ok) {
        const data = await response.json();
        const processingTime = Date.now() - startTime;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
          category: data.category,
          processingTime: data.processing_time_ms || processingTime
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('API Error');
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback responses for demo
      const fallbackResponses: { [key: string]: { text: string; category: string } } = {
        'چطور محصولم را در ایمالز لیست کنم؟': {
          text: 'برای لیست کردن محصول در ایمالز، مراحل زیر را دنبال کنید:\n\n1️⃣ وارد پنل فروشنده شوید\n2️⃣ روی "افزودن محصول جدید" کلیک کنید\n3️⃣ اطلاعات کامل محصول را وارد کنید\n4️⃣ تصاویر با کیفیت آپلود کنید\n5️⃣ قیمت و موجودی را تنظیم کنید\n\nآیا سوال خاصی درباره هر کدام از این مراحل دارید؟',
          category: 'product_listing'
        },
        'مشکل در پرداخت دارم، چه کار کنم؟': {
          text: 'برای حل مشکلات پرداخت:\n\n💳 بررسی کنید اطلاعات کارت صحیح باشد\n📱 از مرورگر بروز استفاده کنید\n🔄 صفحه را refresh کنید و دوباره تلاش کنید\n📞 با پشتیبانی بانک تماس بگیرید\n\nاگر مشکل ادامه داشت، با تیم پشتیبانی ما در تماس باشید.',
          category: 'payment_issues'
        }
      };

      const fallback = fallbackResponses[messageText];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallback?.text || 'متأسفانه در حال حاضر نمی‌توانم به این سوال پاسخ دهم. لطفاً با پشتیبانی تماس بگیرید.',
        sender: 'bot',
        timestamp: new Date(),
        category: fallback?.category || 'general',
        processingTime: Math.random() * 2000 + 1000
      };

      setMessages(prev => [...prev, botMessage]);
      setIsOnline(false);
      setTimeout(() => setIsOnline(true), 3000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryName = (categoryId: string) => {
    // Ensure categories is an array before using find
    if (!Array.isArray(categories)) {
      return categoryId;
    }
    const category = categories.find(c => c.id === categoryId);
    return category?.persian_name || categoryId;
  };

  return (
    <Container maxWidth="lg">
      <Card elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
          color: 'white', 
          p: 3 
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                تجربه کاربری - نمای مشتری
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                شبیه‌سازی چت واقعی مشتری با چت‌بات
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircleIcon 
                sx={{ 
                  fontSize: 12, 
                  color: isOnline ? '#4caf50' : '#f44336' 
                }} 
              />
              <Typography variant="body2">
                {isOnline ? 'آنلاین' : 'آفلاین'}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Suggested Questions */}
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            سوالات پیشنهادی برای تست:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {suggestedQuestions.slice(0, 4).map((question, index) => (
              <Chip
                key={index}
                label={question}
                size="small"
                variant="outlined"
                clickable
                onClick={() => sendMessage(question)}
                sx={{ 
                  mb: 1,
                  '&:hover': { 
                    bgcolor: 'primary.light', 
                    color: 'white' 
                  }
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Messages */}
        <CardContent sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          bgcolor: '#fafafa'
        }}>
          <Stack spacing={2}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-start' : 'flex-end',
                  mb: 1
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    bgcolor: message.sender === 'user' ? '#1976d2' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: message.sender === 'user' ? '20px 20px 20px 5px' : '20px 20px 5px 20px'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: message.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'primary.main'
                      }}
                    >
                      {message.sender === 'user' ? (
                        <PersonIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <BotIcon sx={{ fontSize: 14 }} />
                      )}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {message.text}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <TimeIcon sx={{ fontSize: 12, opacity: 0.7 }} />
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Stack>
                    
                    {message.category && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CategoryIcon sx={{ fontSize: 12, opacity: 0.7 }} />
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {getCategoryName(message.category)}
                        </Typography>
                      </Stack>
                    )}
                    
                    {message.processingTime && (
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {Math.round(message.processingTime)}ms
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'white', borderRadius: '20px 20px 5px 20px' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      <BotIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        در حال تایپ...
                      </Typography>
                      <LinearProgress sx={{ width: 60, mt: 0.5 }} />
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </CardContent>

        {/* Input */}
        <Divider />
        <Box sx={{ p: 2, bgcolor: 'white' }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="پیام خود را اینجا بنویسید..."
              disabled={isTyping}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  paddingRight: 2
                }
              }}
            />
            <IconButton
              onClick={() => sendMessage()}
              disabled={isTyping || !inputText.trim()}
              color="primary"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
          
          <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
            💡 این نمای واقعی تجربه مشتری شما است
          </Alert>
        </Box>
      </Card>
    </Container>
  );
};

export default UserChatDemo;