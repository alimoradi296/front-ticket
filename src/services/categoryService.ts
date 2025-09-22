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

export interface Category {
  id: string;
  name: string;
  persian_name: string;
  description?: string;
  keywords: string[];
  instructions: string;
  qa_content: string;
  is_active: boolean;
  updated_at: string;
}

export interface CategoryInstructions {
  instructions: string;
  category_id: string;
}

export interface CategoryQA {
  qa_content: string;
  category_id: string;
}

export interface NewCategoryRequest {
  persian_name: string;
  description?: string;
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
      body: instructions
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update instructions: ${response.status} ${response.statusText}`);
    }
  },

  // Update category QA
  async updateQA(categoryId: string, qaContent: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/qa`, {
      method: 'PUT',
      headers: getHeaders(),
      body: qaContent
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update QA: ${response.status} ${response.statusText}`);
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
  }
};

export default categoryService;