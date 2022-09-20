import execa from "execa";
export class GitHandler {
  private _remotes: string[] | null;

  constructor(public readonly cwd: string) {}

  async getBranchName() {
    const {stdout} = await execa("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
    return stdout;
  }

  async getRemoteList(): Promise<string[]> {
    if (!this._remotes) {
      const { stdout } = await execa("git", ["remote"]);
      this._remotes = stdout.split("\n");
    }
    return this._remotes;
  }

  isGitRepo(): boolean {
    try {
      execa.commandSync("git rev-parse --is-inside-work-tree", {
        cwd: this.cwd,
      });
      return true;
    } catch {
      return false;
    }
  }

  async commit(commitMessage: string) {
    await execa("git", ["commit", "-m", `"${commitMessage}"`], {
      stdio: "inherit",
    });
  }

  async pushToRemote(currentBranch: string, targetRemote: string) {
    await execa("git", ["push", targetRemote, currentBranch], {
      stdio: "inherit",
    });
  }
}
