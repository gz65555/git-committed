"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = __importDefault(require("cac"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const execa_1 = __importDefault(require("execa"));
const questions = [
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
        validate: (input) => {
            if (input.trim().length <= 0) {
                return "请输入 Commit 信息";
            }
            return true;
        },
    },
];
setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt(questions);
    let { type, scope, message } = answers;
    scope = scope.trim();
    const commitMessage = scope.length <= 0 ? `${type}: ${message}` : `${type}(${scope}): ${message}`;
    console.log(answers);
    console.log(commitMessage);
    const spinner = (0, ora_1.default)("Git commit... ").start();
    try {
        yield (0, execa_1.default)("git", ["commit", "-m", `"${commitMessage}"`], {
            stdio: "inherit",
        });
    }
    catch (e) {
    }
    finally {
        spinner.stop();
    }
}), 0);
const cli = (0, cac_1.default)();
const pkg = fs_extra_1.default.readJSONSync(path_1.default.join(__dirname, "../package.json"));
cli.help();
cli.version(pkg.version);
cli.parse();
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
