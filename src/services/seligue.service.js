import axios from 'axios';

const getUserInfo = async () => {
  const accessToken = localStorage.getItem('seligue@accessToken');
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  try {
    const response = await axios.get('/api/user-info/', { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);

    if (error.response) {
      console.error('Status do erro:', error.response.status);
      console.error('Mensagem de erro:', error.response.data);
    }

    return null;
  }
}

export default getUserInfo;
