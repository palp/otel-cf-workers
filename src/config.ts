import { context } from '@opentelemetry/api'
import { ResolvedTraceConfig, Trigger } from './types'

const configSymbol = Symbol('Otel Workers Tracing Configuration')

export type Initialiser = (env: Record<string, unknown>, trigger: Trigger) => ResolvedTraceConfig

export function setConfig(config: ResolvedTraceConfig, ctx = context.active()) {
	return ctx.setValue(configSymbol, config)
}

const defaultConfig: ResolvedTraceConfig = {
	exporter: { export: () => Promise.resolve(), shutdown: () => Promise.resolve() },
	fetch: { includeTraceContext: true },
	postProcessor: spans => spans,
	sampling: { 
		headSampler: { shouldSample(context, traceId, spanName, spanKind, attributes, links) {
			return { decision: 0, traceState: undefined, attributes: {} }
		}
	},
	tailSampler: () => false},
	service: { name: 'unknown' }
 }

export function getActiveConfig(): ResolvedTraceConfig {
	const config = context.active().getValue(configSymbol) as ResolvedTraceConfig	
	return config ?? defaultConfig
}
