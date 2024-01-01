export const ACTIVE_LIMIT = 5;

export enum JobStatus {
  Running,
  Failed,
  Idle,
}

export enum JobResult {
  Success,
  Failed,
}

export type onFinish = (status: JobResult, err: any) => any;

export class Job {
  public name = "";
  public task = async () => {};
  public callback = (job: any) => {};
  public status = JobStatus.Idle;
  public onFinish = (status: JobResult, err: any) => {};

  public startDate = 0;

  constructor(name: string, task: any, onFinish?: onFinish) {
    this.name = name;
    this.task = task;

    if (onFinish != undefined) {
      this.onFinish = onFinish;
    }
  }

  async run(onFinish: onFinish) {
    this.status = JobStatus.Running;
    this.startDate = Date.now();

    // TODO: FIGURE OUT WHY THE FUCK NODE DOESNT WANT TO CATCH THIS
    try {
      await this.task();
      onFinish(JobResult.Success, null);
    } catch (err) {
      this.status = JobStatus.Failed;
      onFinish(JobResult.Failed, err);
    }
  }
}

export const JobSystem = {
  ActiveJobs: [] as Job[],
  JobQueue: [] as Job[],

  start() {
    this.runThruQueue();
  },

  createJob(name: string, task: () => any, onFinish?: onFinish) {
    const job = new Job(name, task, onFinish);
    this.JobQueue.push(job);

    console.log(
      `Job ${
        job.name
      } has been added to queue with position #${this.JobQueue.indexOf(job)} `,
    );
  },

  runThruQueue() {
    const currentlyRunningJobs = this.ActiveJobs.length;

    if (currentlyRunningJobs >= ACTIVE_LIMIT) {
      // can't really do anything here...
      setTimeout(() => {
        this.runThruQueue();
      }, 5000);
    }

    this.JobQueue.forEach((job) => {
      if (job.status == JobStatus.Running) {
        return;
      }
      // add to active jobs
      this.ActiveJobs.push(job);

      // remove the job from the queue
      this.JobQueue.filter((queuedJob) => queuedJob == job);
      const activeIndex = this.ActiveJobs.indexOf(job);
      console.log(`Job ${job.name} in position ${activeIndex} is starting`);
      job.run((status, err) => {
        if (status == JobResult.Failed) {
          console.log(
            `Job ${job.name} in position ${activeIndex} has failed with error ${err}`,
          );
        } else {
          console.log(
            `Job ${job.name} in position ${activeIndex} has finished successfully`,
          );
        }
        // remove from queue

        this.JobQueue.filter((activeJob) => activeJob == job);
      });
    });
    setTimeout(() => {
      this.runThruQueue();
    }, 5000);
  },
};
