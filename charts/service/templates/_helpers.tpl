{{- define "ethanel.service.labels" -}}
app.kubernetes.io/name: {{ .Release.Name }}
app.kubernetes.io/part-of: ethanel
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "ethanel.service.selectorLabels" -}}
app.kubernetes.io/name: {{ .Release.Name }}
{{- end -}}
