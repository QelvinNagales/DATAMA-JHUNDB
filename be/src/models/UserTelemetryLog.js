import mongoose from 'mongoose';

const UserTelemetryLogSchema = new mongoose.Schema({
  event_type: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
}, { collection: 'user_telemetry_logs' });

export default mongoose.model('UserTelemetryLog', UserTelemetryLogSchema);
