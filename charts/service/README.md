# charts/service — Helm library chart

Every Ethanel Deployment inherits from this chart. It fixes the posture once:

- liveness / readiness / startup probes against the app's health route
- CPU and memory requests and limits
- a PodDisruptionBudget (`minAvailable: 1`)
- non-root user, read-only root filesystem (only `/tmp` writable, as an `emptyDir`), no privilege
  escalation, all capabilities dropped, RuntimeDefault seccomp
- a default-deny NetworkPolicy in both directions; each service opts in explicitly

Sprint 001 ships the templates as named partials. Sprint 002 adds the first consuming chart
(`identity-svc`) and CI linting with `helm lint` + `kubeconform`.
