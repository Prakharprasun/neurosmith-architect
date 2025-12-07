
export type Framework = 'pytorch' | 'tensorflow';
export type ModelType = 'cnn' | 'mlp' | 'transformer' | 'rnn';
export type Optimizer = 'Adam' | 'SGD' | 'RMSprop';

export interface LayerConfig {
  id: string;
  type: string;
  units?: number;
  filters?: number;
  kernel_size?: number;
  dropout_rate?: number;
  activation?: string;
}

export interface TrainingConfig {
  optimizer: Optimizer;
  learning_rate: number;
  epochs: number;
}

export interface UserDropdowns {
  framework: Framework;
  model_type: ModelType;
  layers: LayerConfig[];
  hyperparameters: TrainingConfig;
  isDeterministic?: boolean;
}

export interface ModelComplexity {
  total_parameters: number;
  trainable_parameters: number;
  flops: number;
  memory_mb: number;
  estimated_training_time: {
    T4: string;
    V100: string;
    A100: string;
  };
}

export interface ValidationIssue {
  message: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: ValidationIssue[];
}

export interface FullGenerationResult {
  model_spec: any;
  validation: ValidationResult;
  complexity: ModelComplexity;
  diagram_svg: string;
  generated_code: {
    pytorch: string;
    tensorflow: string;
  };
  rationale: string;
}
