import { createRepairOrderSchema, updateRepairOrderSchema } from './validations';

describe('lib/validations', () => {
  describe('createRepairOrderSchema', () => {
    const validData = {
      title: 'Reparo no elevador',
      description: 'Elevador apresentando problemas',
      location: 'Torre A - Apto 101',
      priority: 'HIGH' as const,
      status: 'OPEN' as const,
      dueDate: new Date('2024-12-31'),
    };

    it('should validate correct data', () => {
      const result = createRepairOrderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        title: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Título é obrigatório');
      }
    });

    it('should reject title longer than 255 characters', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        title: 'a'.repeat(256),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Título deve ter no máximo 255 caracteres');
      }
    });

    it('should accept title with exactly 255 characters', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        title: 'a'.repeat(255),
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty description', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        description: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Descrição é obrigatória');
      }
    });

    it('should reject empty location', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        location: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Local é obrigatório');
      }
    });

    it('should reject location longer than 255 characters', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        location: 'a'.repeat(256),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Local deve ter no máximo 255 caracteres');
      }
    });

    it('should reject invalid priority', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        priority: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Prioridade inválida');
      }
    });

    it('should accept all valid priorities', () => {
      const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
      priorities.forEach(priority => {
        const result = createRepairOrderSchema.safeParse({
          ...validData,
          priority,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Status inválido');
      }
    });

    it('should accept all valid statuses', () => {
      const statuses = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      statuses.forEach(status => {
        const result = createRepairOrderSchema.safeParse({
          ...validData,
          status,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should make status optional', () => {
      const { status, ...dataWithoutStatus } = validData;
      const result = createRepairOrderSchema.safeParse(dataWithoutStatus);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        dueDate: 'invalid-date',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Data de conclusão inválida');
      }
    });

    it('should coerce string date to Date object', () => {
      const result = createRepairOrderSchema.safeParse({
        ...validData,
        dueDate: '2024-12-31',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dueDate).toBeInstanceOf(Date);
      }
    });

    it('should reject missing required fields', () => {
      const result = createRepairOrderSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('updateRepairOrderSchema', () => {
    const validData = {
      id: 'abc-123',
      title: 'Título atualizado',
      description: 'Descrição atualizada',
      location: 'Nova localização',
      priority: 'URGENT' as const,
      status: 'IN_PROGRESS' as const,
      dueDate: new Date('2024-12-31'),
      completedAt: null,
    };

    it('should validate correct data', () => {
      const result = updateRepairOrderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty id', () => {
      const result = updateRepairOrderSchema.safeParse({
        ...validData,
        id: '',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('ID é obrigatório');
      }
    });

    it('should make all fields except id optional', () => {
      const result = updateRepairOrderSchema.safeParse({ id: 'abc-123' });
      expect(result.success).toBe(true);
    });

    it('should validate partial updates', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        title: 'Novo título',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid priority when provided', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        priority: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Prioridade inválida');
      }
    });

    it('should reject invalid status when provided', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        status: 'INVALID',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Status inválido');
      }
    });

    it('should accept null completedAt', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        completedAt: null,
      });
      expect(result.success).toBe(true);
    });

    it('should accept Date completedAt', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        completedAt: new Date(),
      });
      expect(result.success).toBe(true);
    });

    it('should coerce string completedAt to Date', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        completedAt: '2024-01-15',
      });
      expect(result.success).toBe(true);
      if (result.success && result.data.completedAt) {
        expect(result.data.completedAt).toBeInstanceOf(Date);
      }
    });

    it('should reject title longer than 255 characters when provided', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        title: 'a'.repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it('should reject location longer than 255 characters when provided', () => {
      const result = updateRepairOrderSchema.safeParse({
        id: 'abc-123',
        location: 'a'.repeat(256),
      });
      expect(result.success).toBe(false);
    });
  });
});
