import mongoose from 'mongoose'

const {Schema} = mongoose

export const PlanSchema = new Schema({
  venue: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

PlanSchema.index({
  venue: 1,
  user: 1
})

export default mongoose.model('Plan', PlanSchema)
