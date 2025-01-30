import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const FacebookLogin = () => {
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    window.FB.login(async function(response) {
      if (response.authResponse) {
        try {
          // שלח את הטוקן לשרת
          const result = await axios.post('/api/auth/facebook', {
            accessToken: response.authResponse.accessToken
          });

          // שמור את הטוקן בלוקל סטורג'
          localStorage.setItem('token', result.data.token);
          
          // נווט לדף הראשי
          navigate('/dashboard');
        } catch (error) {
          console.error('Error during Facebook login:', error);
          alert('שגיאה בהתחברות. אנא נסה שוב.');
        }
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: 'email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts'
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleFacebookLogin}
      startIcon={<FacebookIcon />}
      fullWidth
      sx={{
        backgroundColor: '#1877f2',
        '&:hover': {
          backgroundColor: '#166fe5'
        }
      }}
    >
      התחבר עם פייסבוק
    </Button>
  );
};

export default FacebookLogin; 