{{- define "ethanel.service.pdb" -}}
{{- if .Values.podDisruptionBudget.enabled }}
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ .Release.Name }}
spec:
  minAvailable: {{ .Values.podDisruptionBudget.minAvailable }}
  selector:
    matchLabels: {{- include "ethanel.service.selectorLabels" . | nindent 6 }}
{{- end }}
{{- end -}}
