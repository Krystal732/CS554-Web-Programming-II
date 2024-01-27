//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.
import blogRoutes from './blog_routes.js';


const constructorMethod = (app) => {
  app.use('/', blogRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
