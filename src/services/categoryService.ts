/**
 * Category API Service
 * Centralized service for category management API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://back-ticket.nikflow.ir';
const API_KEY = process.env.REACT_APP_API_KEY || 'demo_api_key';

const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  priority: number;
  usage_count: number;
  created_at: string;
  is_active: boolean;
}

export interface Category {
  id: string;
  name?: string;
  persian_name: string;
  description?: string;
  keywords: string[];
  instructions?: string;
  qa_pairs: QAPair[];
  is_active?: boolean;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryInstructions {
  instructions: string;
  category_id: string;
}

export interface CategoryQA {
  qa_pairs: QAPair[];
  category_id: string;
}

export interface NewCategoryRequest {
  persian_name: string;
  description?: string;
}

export interface QAPairRequest {
  question: string;
  answer: string;
}

export interface BrandEssentials {
  operator_identity: string;
  marketplace_name: string;
  tone: string;
  personality: string;
  communication_style: string;
  expertise_level: string;
  greeting_style: string;
  problem_solving_approach: string;
  language_formality: string;
  response_length: string;
  human_characteristics: string[];
  brand_values: string[];
  special_instructions: string[];
  version: number;
  updated_at: string;
}

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get single category
  async getCategory(categoryId: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get category instructions only
  async getCategoryInstructions(categoryId: string): Promise<CategoryInstructions> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/instructions`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch instructions: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get category QA only
  async getCategoryQA(categoryId: string): Promise<CategoryQA> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch QA: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Update category instructions
  async updateInstructions(categoryId: string, instructions: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/instructions`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ content: instructions })
    });

    if (!response.ok) {
      throw new Error(`Failed to update instructions: ${response.status} ${response.statusText}`);
    }
  },

  // Update category QA pairs (replaces all)
  async updateQAPairs(categoryId: string, qaPairs: QAPairRequest[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(qaPairs)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update QA pairs: ${response.status} ${response.statusText}`);
    }
  },

  // Add single QA pair to category
  async addQAPair(categoryId: string, qaPair: QAPairRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(qaPair)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add QA pair: ${response.status} ${response.statusText}`);
    }
  },

  // Update single QA pair
  async updateQAPair(categoryId: string, qaPairId: string, qaPair: QAPairRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa/${qaPairId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(qaPair)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update QA pair: ${response.status} ${response.statusText}`);
    }
  },

  // Delete single QA pair
  async deleteQAPair(categoryId: string, qaPairId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa/${qaPairId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete QA pair: ${response.status} ${response.statusText}`);
    }
  },

  // Create new category
  async createCategory(categoryData: NewCategoryRequest): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Delete category (soft delete)
  async deleteCategory(categoryId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.status} ${response.statusText}`);
    }
  },

  // Get brand essentials
  async getBrandEssentials(): Promise<BrandEssentials> {
    const response = await fetch(`${API_BASE_URL}/api/v1/brand`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand essentials: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Update brand essentials
  async updateBrandEssentials(brandData: Partial<BrandEssentials>): Promise<BrandEssentials> {
    const response = await fetch(`${API_BASE_URL}/api/v1/brand`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(brandData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update brand essentials: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  },

  // Search QA pairs
  async searchQAPairs(query: string, categoryIds?: string[], limit: number = 10): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    if (categoryIds && categoryIds.length > 0) {
      params.append('category_ids', categoryIds.join(','));
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/search/qa?${params}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to search QA pairs: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default categoryService;