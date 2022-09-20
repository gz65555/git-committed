import cac from "cac";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import execa from "execa";
import { GitHandler } from "./git/GitHandler";

const gitHandler = new GitHandler(process.cwd());

if(!gitHandler.isGitRepo()) {
  console.log("Not a git repo");
  process.exit(1);
}

const needPushQuestion = [
  {
    type: "confirm",
    name: "needPush",
    message: "是否需要 push",
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
  const list = await gitHandler.getRemoteList();
  const defaultBranch = list.includes("origin") ? "origin": list[0];

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
    {
      type: "confirm",
      name: "needPush",
      message: "是否需要 push",
      default: "",
      validate: (input: string) => {
        if (input.trim().length <= 0) {
          return "请输入 Commit 信息";
        }
        return true;
      },
      when: () => {
        return list.length > 0;
      }
    },
    {
      type: "list",
      name: "remote",
      choices: async () => {
        const remotes = await gitHandler.getRemoteList();
        return remotes.map((item) => {
          return {
            name: item,
            value: item,
          };
        });
      },
      default: defaultBranch,
      when: (answers) => {
        return answers.needPush && list.length > 1;
      }
    },
  ];
  const answers = await inquirer.prompt(questions);
  let { type, scope, message, needPush, remote } = answers;
  remote = remote ?? list[0];

  scope = scope.trim();
  const commitMessage =
    scope.length <= 0 ? `${type}: ${message}` : `${type}(${scope}): ${message}`;
  const spinner = ora("Git committing... ").start();
  try {
    gitHandler.commit(commitMessage);
  } catch (e) {
    process.exit(1);
  } finally {
    spinner.succeed("Git commit success");
  }

  if(list.length <= 0) {
    console.log("当前没有远程仓库");
    return;
  }

  if (needPush) {
    const spinner = ora("Git pushing... ").start();
    const currentBranch = await gitHandler.getBranchName();
    try {
      await gitHandler.pushToRemote(currentBranch, remote);
    } catch(e) {
      process.exit(1);
    } finally {
      spinner.succeed("Git push success");
    }
  }

}, 0);

const cli = cac();

const pkg = fs.readJSONSync(path.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();
