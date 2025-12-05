import app from './app';
import { startScheduler } from './api/v1/services/eventScheduler';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  
  // Start scheduled tasks
  startScheduler();
});
