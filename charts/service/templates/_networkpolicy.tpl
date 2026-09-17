{{- define "ethanel.service.networkpolicy" -}}
{{- if .Values.networkPolicy.enabled }}
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ .Release.Name }}-default-deny
spec:
  podSelector:
    matchLabels: {{- include "ethanel.service.selectorLabels" . | nindent 6 }}
  policyTypes: [Ingress, Egress]
  ingress: {{- toYaml .Values.networkPolicy.ingressFrom | nindent 4 }}
  egress: {{- toYaml .Values.networkPolicy.egressTo | nindent 4 }}
{{- end }}
{{- end -}}
