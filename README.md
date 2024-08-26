# Factojet

The app's goal is to easily organize work within a factory in a easy and automatic approach, the goal is not for a perfect automatic project management tool but for a good enough solution to manage multi project complex management problems that usually would require weeks of project management to acquire an optimal solution.

---

## How to run:

- Run npm i command inside both directories (Client + Server)

- You will need a mobiscroll account to install mobiscroll components ([MobiScroll](https://download.mobiscroll.com/trial)) 

- Change the data-source.ts inside the server folder to match your DB

- If you want to the project upload feauture working, set up your own cloudinary 
  
  - change the fetch link  and upload_preset on ProjectForm.tsx

- Run `npm run dev` on both directories

- Enjoy!

---

### Stack:

- Typescript

- Express

- TypeORM

- Postgres

- React

- Mantine

- Mobiscroll

- Cloudinary

---
## Improvements

As previously mentioned the main goal of the app is the reorganization and finding a good enough solution for the multi project problem, one big problem with factories on top of the distribution of work is the distribution of equipment necessary for certain tasks, so further improvements would be directed towards making a good enough algorithm to distribute work, for that the db would need to have the following changes:

### Person Importance

This table holds the value of importance calculated by the total of hours needed for the current projects skillsets. Example:

If it's currently needed a total 150hours of CNC and 40hours of forklift, if John has both skills his value will be 190, and if Bertha only has CNC skills then Bertha will have a value of 150.

So when picking a person to do a certain task it will always pick the one with least importance.

---

### Person Rating

The goal with the addition of ratings would be for the admin to be able to setup a minimum rating for certain projects. 

---

### Better Person Availability

Save the data as arrays with time intervals for more complex availabilities

---

### Equipment

In a realistic setting equipment limits the work assignment as much as the number of workers, so it should be taken into consideration in order to make it usable in a real setting, this also requires that the Skill table to hold an array with the needed equipment. 

---

---

## Preview

![](readImgs/schedule.png)

![](readImgs/solu.png)

![](readImgs/proj.png)

![](readImgs/tasks.png)

![](readImgs/editTask.png)

![](readImgs/workers.png)
![](readImgs/workAdd.png)
