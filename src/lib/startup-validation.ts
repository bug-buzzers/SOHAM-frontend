/**
 * Startup Validation
 * Validates critical configuration on app startup
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate Groq API key
 */
export function validateGroqKey(): { valid: boolean; message?: string } {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      message: 'GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys',
    };
  }
  
  if (!apiKey.startsWith('gsk_')) {
    return {
      valid: false,
      message: 'GROQ_API_KEY appears invalid (should start with "gsk_")',
    };
  }
  
  if (apiKey.length < 20) {
    return {
      valid: false,
      message: 'GROQ_API_KEY appears too short to be valid',
    };
  }
  
  return { valid: true };
}

/**
 * Validate Hugging Face API key
 */
export function validateHuggingFaceKey(): { valid: boolean; message?: string } {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      message: 'HUGGINGFACE_API_KEY is not set. Get a free key at https://huggingface.co/settings/tokens',
    };
  }
  
  if (!apiKey.startsWith('hf_')) {
    return {
      valid: false,
      message: 'HUGGINGFACE_API_KEY appears invalid (should start with "hf_")',
    };
  }
  
  if (apiKey.length < 20) {
    return {
      valid: false,
      message: 'HUGGINGFACE_API_KEY appears too short to be valid',
    };
  }
  
  return { valid: true };
}

/**
 * Validate Google API key
 */
export function validateGoogleKey(): { valid: boolean; message?: string } {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      message: 'GOOGLE_API_KEY is not set. Get a free key at https://aistudio.google.com/app/apikey',
    };
  }
  
  if (!apiKey.startsWith('AIza')) {
    return {
      valid: false,
      message: 'GOOGLE_API_KEY appears invalid (should start with "AIza")',
    };
  }
  
  if (apiKey.length < 30) {
    return {
      valid: false,
      message: 'GOOGLE_API_KEY appears too short to be valid',
    };
  }
  
  return { valid: true };
}

/**
 * Validate Firebase configuration
 */
export function validateFirebaseConfig(): { valid: boolean; message?: string } {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing Firebase config: ${missing.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Run all startup validations
 */
export function validateStartup(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Critical: Groq API key
  const groqValidation = validateGroqKey();
  if (!groqValidation.valid) {
    errors.push(`❌ ${groqValidation.message}`);
  } else {
    console.log('✅ Groq API key configured');
  }
  
  // Optional: Hugging Face API key
  const hfValidation = validateHuggingFaceKey();
  if (!hfValidation.valid) {
    warnings.push(`⚠️  ${hfValidation.message}`);
  } else {
    console.log('✅ Hugging Face API key configured');
  }
  
  // Optional: Google API key
  const googleValidation = validateGoogleKey();
  if (!googleValidation.valid) {
    warnings.push(`⚠️  ${googleValidation.message}`);
  } else {
    console.log('✅ Google API key configured');
  }
  
  // Critical: Firebase config
  const firebaseValidation = validateFirebaseConfig();
  if (!firebaseValidation.valid) {
    errors.push(`❌ ${firebaseValidation.message}`);
  } else {
    console.log('✅ Firebase configuration valid');
  }
  
  // Log results
  if (errors.length > 0) {
    console.error('\n🚨 STARTUP VALIDATION FAILED:\n');
    errors.forEach(error => console.error(error));
    console.error('\n');
  }
  
  if (warnings.length > 0) {
    console.warn('\n⚠️  STARTUP WARNINGS:\n');
    warnings.forEach(warning => console.warn(warning));
    console.warn('\n');
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All startup validations passed!\n');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate and throw if critical errors
 */
export function validateOrThrow(): void {
  const result = validateStartup();
  
  if (!result.valid) {
    throw new Error(
      `Startup validation failed:\n${result.errors.join('\n')}\n\n` +
      'Please check your .env.local file and ensure all required environment variables are set.'
    );
  }
}
