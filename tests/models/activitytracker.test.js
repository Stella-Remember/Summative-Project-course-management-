const { ActivityTracker, CourseOffering, Module, Class, Cohort, Facilitator, Mode, User } = require('../../src/models');
const { sequelize } = require('../../src/models');

describe('ActivityTracker Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await ActivityTracker.destroy({ where: {} });
    await CourseOffering.destroy({ where: {} });
    await Module.destroy({ where: {} });
    await Class.destroy({ where: {} });
    await Cohort.destroy({ where: {} });
    await Facilitator.destroy({ where: {} });
    await Mode.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('ActivityTracker Creation', () => {
    let courseOffering;

    beforeEach(async () => {
      // Create required dependencies
      const user = await User.create({
        email: 'facilitator@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'facilitator'
      });

      const facilitator = await Facilitator.create({
        user_id: user.id,
        employee_id: 'EMP001'
      });

      const module = await Module.create({
        code: 'CS101',
        name: 'Introduction to Programming',
        credits: 3,
        duration_weeks: 12
      });

      const classEntity = await Class.create({
        name: '2024S',
        year: 2024,
        semester: 'S'
      });

      const cohort = await Cohort.create({
        name: 'Software Engineering 2024',
        start_date: '2024-01-15',
        end_date: '2024-12-15',
        max_students: 30
      });

      const mode = await Mode.create({
        name: 'online'
      });

      courseOffering = await CourseOffering.create({
        module_id: module.id,
        class_id: classEntity.id,
        cohort_id: cohort.id,
        facilitator_id: facilitator.id,
        mode_id: mode.id,
        trimester: '1',
        intake_period: 'HT1',
        start_date: '2024-01-15',
        end_date: '2024-04-15'
      });
    });

    it('should create activity tracker with valid data', async () => {
      const activityData = {
        allocation_id: courseOffering.id,
        week_number: 1,
        attendance: [true, false, true, true, false],
        formative_one_grading: 'Done',
        summative_grading: 'Pending',
        notes: 'Good progress this week'
      };

      const activity = await ActivityTracker.create(activityData);
      
      expect(activity.allocation_id).toBe(courseOffering.id);
      expect(activity.week_number).toBe(1);
      expect(activity.attendance).toEqual([true, false, true, true, false]);
      expect(activity.formative_one_grading).toBe('Done');
      expect(activity.formative_two_grading).toBe('Not Started'); // Default value
      expect(activity.summative_grading).toBe('Pending');
      expect(activity.notes).toBe('Good progress this week');
    });

    it('should not allow duplicate allocation_id and week_number', async () => {
      await ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 1,
        formative_one_grading: 'Done'
      });

      await expect(ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 1,
        formative_one_grading: 'Pending'
      })).rejects.toThrow();
    });

    it('should validate week_number range', async () => {
      await expect(ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 0
      })).rejects.toThrow();

      await expect(ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 53
      })).rejects.toThrow();
    });

    it('should validate enum values for grading status', async () => {
      await expect(ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 1,
        formative_one_grading: 'Invalid Status'
      })).rejects.toThrow();
    });
  });

  describe('ActivityTracker Default Values', () => {
    let courseOffering;

    beforeEach(async () => {
      // Create required dependencies
      const user = await User.create({
        email: 'facilitator@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'facilitator'
      });

      const facilitator = await Facilitator.create({
        user_id: user.id,
        employee_id: 'EMP001'
      });

      const module = await Module.create({
        code: 'CS101',
        name: 'Introduction to Programming',
        credits: 3,
        duration_weeks: 12
      });

      const classEntity = await Class.create({
        name: '2024S',
        year: 2024,
        semester: 'S'
      });

      const cohort = await Cohort.create({
        name: 'Software Engineering 2024',
        start_date: '2024-01-15',
        end_date: '2024-12-15',
        max_students: 30
      });

      const mode = await Mode.create({
        name: 'online'
      });

      courseOffering = await CourseOffering.create({
        module_id: module.id,
        class_id: classEntity.id,
        cohort_id: cohort.id,
        facilitator_id: facilitator.id,
        mode_id: mode.id,
        trimester: '1',
        intake_period: 'HT1',
        start_date: '2024-01-15',
        end_date: '2024-04-15'
      });
    });

    it('should set default values for grading status fields', async () => {
      const activity = await ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 1
      });

      expect(activity.formative_one_grading).toBe('Not Started');
      expect(activity.formative_two_grading).toBe('Not Started');
      expect(activity.summative_grading).toBe('Not Started');
      expect(activity.course_moderation).toBe('Not Started');
      expect(activity.intranet_sync).toBe('Not Started');
      expect(activity.grade_book_status).toBe('Not Started');
      expect(activity.attendance).toEqual([]);
    });

    it('should allow updating status fields', async () => {
      const activity = await ActivityTracker.create({
        allocation_id: courseOffering.id,
        week_number: 1
      });

      await activity.update({
        formative_one_grading: 'Pending',
        summative_grading: 'Done',
        attendance: [true, true, false]
      });

      expect(activity.formative_one_grading).toBe('Pending');
      expect(activity.summative_grading).toBe('Done');
      expect(activity.attendance).toEqual([true, true, false]);
    });
  });
});
