import cac from "cac";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import execa from "execa";

const questions: inquirer.QuestionCollection[] = [
  {
    type: "list",
    name: "type",
    message: "设置 Commit 类型",
    choices: [
      {
        name: "feat: 新功能 (feature)",
        value: "feat",
      },
      {
        name: "fix: 修复 Bug (bug fix)",
        value: "fix",
      },
      {
        name: "docs: 文档 (documentation)",
        value: "docs",
      },
      {
        name: "style: 格式 (white-space, formatting, missing semi colons, etc)",
        value: "style",
      },
      {
        name: "refactor: 重构 (refactoring production code)",
        value: "refactor",
      },
      {
        name: "perf: 性能优化 (performance improvement)",
        value: "perf",
      },
      {
        name: "test: 测试 (when adding missing tests)",
        value: "test",
      },
      {
        name: "chore: 构建过程或辅助工具的变动 (maintain)",
        value: "chore",
      },
      {
        name: "revert: 回滚 (revert to a commit)",
        value: "revert",
      },
    ],
    default: "feat",
  },
  {
    type: "input",
    name: "scope",
    message: "设置 Commit Scope",
    default: "",
  },
  {
    type: "input",
    name: "message",
    message: "设置 Commit 信息",
    default: "",
    validate: (input: string) => {
      if (input.trim().length <= 0) {
        return "请输入 Commit 信息";
      }
      return true;
    },
  },
];

setTimeout(async () => {
  const answers = await inquirer.prompt(questions);
  let { type, scope, message } = answers;
  scope = scope.trim();
  const commitMessage =
    scope.length <= 0 ? `${type}: ${message}` : `${type}(${scope}): ${message}`;
  console.log(answers);
  console.log(commitMessage);
  const spinner = ora("Git commit... ").start();
  try {
    await execa("git", ["commit", "-m", `"${commitMessage}"`], {
      stdio: "inherit",
    });
  } catch (e) {
  } finally {
    spinner.stop();
  }
}, 0);

const cli = cac();

const pkg = fs.readJSONSync(path.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
