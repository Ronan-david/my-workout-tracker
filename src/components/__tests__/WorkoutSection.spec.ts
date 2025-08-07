import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import WorkoutSection from '@/components/WorkoutSection.vue';
import type { DailyWorkout } from '@/types/workout';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const mockWorkouts: DailyWorkout[] = [
  {
    date: new Date().toISOString().split('T')[0], // Today
    exercises: [
      { 
        exerciseId: '1',
        exercise: { 
          id: '1',
          name: 'Bench Press',
          category: 'Chest',
          description: 'Chest exercise',
          targetMuscles: ['chest', 'triceps'],
          difficulty: 'beginner'
        }, 
        sets: [{ reps: 10, weight: 100, completedAt: new Date() }] 
      },
      { 
        exerciseId: '2',
        exercise: { 
          id: '2',
          name: 'Deadlift',
          category: 'Back',
          description: 'Back exercise',
          targetMuscles: ['back', 'glutes'],
          difficulty: 'intermediate'
        }, 
        sets: [{ reps: 8, weight: 150, completedAt: new Date() }] 
      },
    ],
    completed: true,
  },
  {
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    exercises: [
      { 
        exerciseId: '3',
        exercise: { 
          id: '3',
          name: 'Squat',
          category: 'Legs',
          description: 'Leg exercise',
          targetMuscles: ['quads', 'glutes'],
          difficulty: 'intermediate'
        }, 
        sets: [{ reps: 5, weight: 200, completedAt: new Date() }] 
      },
    ],
    completed: false,
  },
  {
    date: '2023-01-01',
    exercises: [
      { 
        exerciseId: '4',
        exercise: { 
          id: '4',
          name: 'Overhead Press',
          category: 'Shoulders',
          description: 'Shoulder exercise',
          targetMuscles: ['shoulders', 'triceps'],
          difficulty: 'beginner'
        }, 
        sets: [{ reps: 12, weight: 60, completedAt: new Date() }] 
      },
    ],
    completed: true,
  },
];

describe('Given the components renders correctly', () => {
  let wrapper: VueWrapper<InstanceType<typeof WorkoutSection>>;

  beforeEach(() => {
    wrapper = mount(WorkoutSection, {
      props: {
        workouts: mockWorkouts,
      },
    });
  });


  test('Then it renders the component with workouts', () => {

    expect(wrapper.find('h2').text()).toBe('workout.title');

    const workoutItems = wrapper.findAll('.workout-item');
    expect(workoutItems.length).toBe(mockWorkouts.length);
  });

  test('Then it displays the correct date formatting', async () => {
    const workoutDates = wrapper.findAll('.workout-date h3');

    expect(workoutDates[0].text()).toBe('Today');

    expect(workoutDates[1].text()).toBe('Yesterday');

    const specificDate = new Date('2023-01-01').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(workoutDates[2].text()).toBe(specificDate);
  });

  test('Then it shows the correct completion status', () => {
    const statuses = wrapper.findAll('.workout-status');

    expect(statuses[0].text()).toBe('Completed');
    expect(statuses[0].classes()).toContain('completed');

    expect(statuses[1].text()).toBe('In Progress');
    expect(statuses[1].classes()).not.toContain('completed');
  });

  describe('Given the pagination can be shown', () => {
    describe('When there are less than 10 workouts', () => {
      test('Then it disables the pagination buttons', () => {
        expect(wrapper.find('.pagination').exists()).toBe(false);
      });
    });

    describe('When there are more than 10 workouts', () => {
      test('Then it paginates the workouts', async () => {
      const largeWorkoutList: DailyWorkout[] = Array.from({ length: 15 }, (_, i) => ({
        date: `2023-01-${String(i + 1).padStart(2, '0')}`,
        exercises: [
          { 
            exerciseId: `${i}`,
            exercise: { 
              id: `${i}`,
              name: 'Test Exercise',
              category: 'Test',
              description: 'Test exercise',
              targetMuscles: ['test'],
              difficulty: 'beginner'
            }, 
            sets: [{ reps: 1, weight: 1, completedAt: new Date() }] 
          },
        ],
        completed: i % 2 === 0,
      }));

      const wrapper = mount(WorkoutSection, {
        props: {
          workouts: largeWorkoutList,
        },
      });

      expect(wrapper.findAll('.workout-item').length).toBe(10);

      expect(wrapper.find('.page-info').text()).toBe('Page 1 of 2');

      const nextButton = wrapper.findAll('.page-btn')[1];

      await nextButton.trigger('click');
      
      await wrapper.vm.$nextTick();
      
      expect(wrapper.findAll('.workout-item').length).toBe(5);
      expect(wrapper.find('.page-info').text()).toBe('Page 2 of 2');

      const prevButton = wrapper.findAll('.page-btn')[0];
      expect(prevButton.attributes('disabled')).toBeUndefined();
      
      expect(nextButton.attributes('disabled')).toBeDefined();
      });
    });
  });

});

