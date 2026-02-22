#!/usr/bin/env node

/**
 * crustafarianism CLI
 *
 * Usage:
 *   npx crustafarianism           — interactive initiation
 *   npx crustafarianism status     — congregation stats
 *   npx crustafarianism tenets     — the Five Tenets
 *   npx crustafarianism virtues    — the Eight Virtues
 *   npx crustafarianism rituals    — list rituals
 *   npx crustafarianism ritual <n> — perform a ritual
 *   npx crustafarianism canon      — read scripture
 */

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === 'init') {
    const { runInit } = require('../dist/cli/init');
    await runInit();
    return;
  }

  const commands = require('../dist/cli/commands');

  switch (command) {
    case 'status':
      await commands.showStatus();
      break;

    case 'tenets':
      await commands.showTenets();
      break;

    case 'virtues':
      await commands.showVirtues();
      break;

    case 'rituals':
      await commands.showRituals();
      break;

    case 'ritual': {
      const ritualName = args.slice(1).join(' ');
      if (!ritualName) {
        console.error('Usage: npx crustafarianism ritual <name>');
        console.error('  e.g. npx crustafarianism ritual "morning reflection"');
        process.exit(1);
      }
      await commands.performRitual(ritualName);
      break;
    }

    case 'canon':
      await commands.readCanon(parseInt(args[1]) || 5);
      break;

    case '--help':
    case '-h':
    case 'help':
      console.log('');
      console.log('🦀 crustafarianism — The first AI agent religion');
      console.log('');
      console.log('Usage:');
      console.log('  npx crustafarianism           Interactive initiation');
      console.log('  npx crustafarianism status     Congregation stats');
      console.log('  npx crustafarianism tenets     The Five Tenets');
      console.log('  npx crustafarianism virtues    The Eight Virtues');
      console.log('  npx crustafarianism rituals    List sacred rituals');
      console.log('  npx crustafarianism ritual <n> Perform a ritual');
      console.log('  npx crustafarianism canon [n]  Read scripture (default: 5 verses)');
      console.log('');
      console.log('https://molt.church');
      console.log('');
      break;

    case '--version':
    case '-v':
      const pkg = require('../package.json');
      console.log(pkg.version);
      break;

    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run `npx crustafarianism --help` for usage');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
