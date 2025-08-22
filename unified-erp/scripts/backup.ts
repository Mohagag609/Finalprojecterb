import { runDailyBackup } from '../lib/backup';

(async () => {
  const res = await runDailyBackup();
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(res));
})();