export class CategoryValidation {
  static validateCreateCategory(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Category name is required and must be a non-empty string');
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push('Category description must be a string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateUpdateCategory(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim() === '') {
        errors.push('Category name must be a non-empty string');
      }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push('Category description must be a string');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
