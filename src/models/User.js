import mongoose from 'mongoose';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[\s\S]{8,}$/;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String
    },
    address: {
        type: String
    }
}, { timestamps: true });

// Restricción de password: min 8 caracteres, min 1 mayúscula, min 1 dígito, min 1 caracter especial (# $ % & * @)
UserSchema.statics.validatePassword = function (password) {
    return PASSWORD_REGEX.test(password || '');
};

// Cálculo de edad a partir de birthdate
UserSchema.virtual('age').get(function () {
    if (!this.birthdate) return null;
    const today = new Date();
    const birth = new Date(this.birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', UserSchema);
