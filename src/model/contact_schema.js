const { Schema, model, SchemaTypes } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    owner: { 
      type: SchemaTypes.ObjectId, 
      ref: 'user' },
    features: {
      type: Array,
      set: (data) => (!data ? [] : data),
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  },
);

contactSchema.virtual('info').get(function () {
  return `This is ${this.name} email: ${this.email} phone: ${this.phone} `;
});

contactSchema.path('name').validate((value) => {
  const re = /[A-Z]\w+/g
  return re.test(String(value))
})

const Contact = model('contact', contactSchema);

module.exports = Contact;
