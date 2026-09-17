{{/*
ethanel.service.deployment — rendered by each consuming chart via:
  {{ include "ethanel.service.deployment" . }}
Sprint 001: skeleton with the security posture fixed. Sprint 002 completes probes/env wiring.
*/}}
{{- define "ethanel.service.deployment" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}
  labels: {{- include "ethanel.service.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels: {{- include "ethanel.service.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels: {{- include "ethanel.service.selectorLabels" . | nindent 8 }}
    spec:
      terminationGracePeriodSeconds: {{ .Values.terminationGracePeriodSeconds }}
      securityContext:
        runAsNonRoot: {{ .Values.securityContext.runAsNonRoot }}
        runAsUser: {{ .Values.securityContext.runAsUser }}
        runAsGroup: {{ .Values.securityContext.runAsGroup }}
        seccompProfile: {{- toYaml .Values.securityContext.seccompProfile | nindent 10 }}
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
          securityContext:
            readOnlyRootFilesystem: {{ .Values.securityContext.readOnlyRootFilesystem }}
            allowPrivilegeEscalation: {{ .Values.securityContext.allowPrivilegeEscalation }}
            capabilities: {{- toYaml .Values.securityContext.capabilities | nindent 14 }}
          livenessProbe:
            httpGet: { path: {{ .Values.probes.liveness.path }}, port: http }
            initialDelaySeconds: {{ .Values.probes.liveness.initialDelaySeconds }}
            periodSeconds: {{ .Values.probes.liveness.periodSeconds }}
          readinessProbe:
            httpGet: { path: {{ .Values.probes.readiness.path }}, port: http }
            initialDelaySeconds: {{ .Values.probes.readiness.initialDelaySeconds }}
            periodSeconds: {{ .Values.probes.readiness.periodSeconds }}
          startupProbe:
            httpGet: { path: {{ .Values.probes.startup.path }}, port: http }
            failureThreshold: {{ .Values.probes.startup.failureThreshold }}
            periodSeconds: {{ .Values.probes.startup.periodSeconds }}
          resources: {{- toYaml .Values.resources | nindent 12 }}
          env: {{- toYaml .Values.env | nindent 12 }}
          envFrom: {{- toYaml .Values.envFrom | nindent 12 }}
          {{- if .Values.writableTmp }}
          volumeMounts:
            - name: tmp
              mountPath: /tmp
          {{- end }}
      {{- if .Values.writableTmp }}
      volumes:
        - name: tmp
          emptyDir: {}
      {{- end }}
{{- end -}}
