const prometheus = require('prom-client');
const responseTime = require('response-time');

// Create a Registry which registers the metrics
const register = new prometheus.Registry();

// Enable collection of default metrics
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const apiMetrics = {
  httpRequestDurationMicroseconds: new prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
  }),
  customCounters: new prometheus.Counter({
    name: 'custom_counters',
    help: 'Custom business metrics counter',
    labelNames: ['name']
  }),
  databaseQueryDuration: new prometheus.Histogram({
    name: 'db_query_duration_ms',
    help: 'Duration of database queries in ms',
    labelNames: ['operation', 'model']
  }),
  teamCreationDuration: new prometheus.Histogram({
    name: 'team_creation_duration_ms',
    help: 'Duration of team creation in ms',
    labelNames: ['operation'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
  })
};

// Register custom metrics
register.registerMetric(apiMetrics.httpRequestDurationMicroseconds);
register.registerMetric(apiMetrics.customCounters);
register.registerMetric(apiMetrics.databaseQueryDuration);
register.registerMetric(apiMetrics.teamCreationDuration);

const requestMetricsMiddleware = responseTime((req, res, time) => {
  const route = req.route?.path || req.path;
  apiMetrics.httpRequestDurationMicroseconds
    .labels(req.method, route, res.statusCode)
    .observe(time);
});

const increment = (name, value = 1) => {
  apiMetrics.customCounters.labels(name).inc(value);
};

const trackDbQuery = (operation, model, startTime) => {
  const diff = process.hrtime(startTime);
  const duration = diff[0] * 1000 + diff[1] / 1000000;
  apiMetrics.databaseQueryDuration
    .labels(operation, model)
    .observe(duration);
};

const getMetrics = async () => {
  return register.metrics();
};

module.exports = {
  increment,
  histogram: apiMetrics.httpRequestDurationMicroseconds,
  teamCreationDuration: apiMetrics.teamCreationDuration, // Export the new histogram
  trackDbQuery,
  requestMetricsMiddleware,
  getMetrics
};