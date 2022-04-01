const windowsKillServer = (pid: number) => {
  Deno.run({
    /**
     * On Windows the process we spawned (and thus have a handle for) is cmd.
     * The server is a child process of that process, so we have to kill the entire process tree.
     */
    cmd: ["taskkill", "/PID", pid.toString(), "/T", "/F"],
    stdout: "null",
  });
};

const unixKillServer = (pid: number) => {
  Deno.kill(pid, "SIGTERM");
};

const getStartServer = (prependCommand: string[] = []) => () =>
  Deno.run({
    cmd: prependCommand.concat(["netlify", "dev"].concat(Deno.args)),
  });

const [startServer, killServer] = Deno.build.os === "windows"
  ? [getStartServer(["cmd", "/c"]), windowsKillServer]
  : [getStartServer(), unixKillServer];

export { startServer, killServer };
