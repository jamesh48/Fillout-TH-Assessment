import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
