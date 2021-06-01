const Joi = require('joi');
const mongoose = require('mongoose');

const schemaCreateContact = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().min(9).max(19).required(),
    isFavirite: Joi.boolean().optional()
})
   
const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
  phone: Joi.number().min(9).max(19).optional(),
  isFavirite: Joi.boolean().optional()
}).or('name', 'email', 'phone', 'isFavorite')

const schemaUpdateStatusContact = Joi.object({
  isFavorite: Joi.boolean().required()
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    next()  
  } catch (err) {
    next ({
      status: 400,
      message: err.message.replace(/ */g, ''),
    })
   }
}

module.exports = {
  validationCreateContact: (req, res, next) => {
    return validate(schemaCreateContact, req.body, next)    
  },
  validationUpdateContact: (req, res, next) => {
    return validate(schemaUpdateContact, req.body, next)    
  },
  validationUpdateStatusContact: (req, res, next) => {
    return validate(schemaUpdateStatusContact, req.body, next)    
  },
  validateMongoId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({
        status: 400,
        message: 'Invalid ObjectId',
      })
    };
    next();
  },
}