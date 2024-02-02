import spaceXRoutes from './spaceX.js';

const constructorMethod = (app) => {
  app.use('/api', spaceXRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route not valid'});
  });
};

export default constructorMethod;
