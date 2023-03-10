// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

(function () {
  execSync('yarn patch-package', { stdio: 'inherit' });
  console.log('Link font Android Done!!✨✨✨✨✨');
  if (process.platform === 'darwin') {
    execSync('cd ios && touch tmp.xcconfig');
    console.log(
      '                  🧐🧐🧐🧐🧐 Starting bundle install!! 🧐🧐🧐🧐🧐',
    );
    execSync('bundle install');
    console.log('bundle install Done!!✨✨✨✨✨');
    console.log(
      '                  🧐🧐🧐🧐🧐 Starting pod install!! 🧐🧐🧐🧐🧐',
    );
    execSync('bundle exec pod install --project-directory=ios', {
      stdio: 'inherit',
    });
    console.log('                      ✨✨✨✨✨ Pod done!!! ✨✨✨✨✨');
  }
})();
