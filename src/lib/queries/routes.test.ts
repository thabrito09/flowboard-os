import { describe, it, expect } from 'vitest';
import { calculateRouteProgress } from './routes';

describe('Route Progress Calculation', () => {
  it('should calculate 0% for empty phases', () => {
    const phases: any[] = [];
    expect(calculateRouteProgress(phases)).toBe(0);
  });

  it('should calculate 100% when all tasks are completed', () => {
    const phases: any[] = [
      {
        id: '1',
        name: 'Phase 1',
        checklist: [
          { id: '1', text: 'Task 1', completed: true },
          { id: '2', text: 'Task 2', completed: true },
        ],
        completed: true,
      },
    ];
    expect(calculateRouteProgress(phases)).toBe(100);
  });

  it('should calculate 50% when half of tasks are completed', () => {
    const phases: any[] = [
      {
        id: '1',
        name: 'Phase 1',
        checklist: [
          { id: '1', text: 'Task 1', completed: true },
          { id: '2', text: 'Task 2', completed: false },
        ],
        completed: false,
      },
    ];
    expect(calculateRouteProgress(phases)).toBe(50);
  });

  it('should handle multiple phases correctly', () => {
    const phases: any[] = [
      {
        id: '1',
        name: 'Phase 1',
        checklist: [
          { id: '1', text: 'Task 1', completed: true },
          { id: '2', text: 'Task 2', completed: true },
        ],
        completed: true,
      },
      {
        id: '2',
        name: 'Phase 2',
        checklist: [
          { id: '3', text: 'Task 3', completed: false },
          { id: '4', text: 'Task 4', completed: false },
        ],
        completed: false,
      },
    ];
    expect(calculateRouteProgress(phases)).toBe(50);
  });
});
