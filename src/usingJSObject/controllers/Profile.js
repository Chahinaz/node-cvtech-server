import ProfileModel from '../models/Profile';

const Profile = {
    signUp(req, res){
        if(!req.body.firstName && !req.body.lastName && !req.body.email){
            return res.status(404).send({'message': 'All fields are required.'});
        }

        const profile = ProfileModel.signUp(req.body);
        return res.status(201).send(profile);
    },

    getAll(req, res){
      const profiles = ProfileModel.findAll();
      return res.status(200).send(profiles);
    },

    getOne(req, res){
        const profile = ProfileModel.findOne(req.params.id);
        if(!profile){
            return res.status(404).send({'message': 'Profile not found.'});
        }
        return res.status(201).send(profile);
    },

    update(req, res){
        const profile = ProfileModel.findOne(req.params.id);
        if(!profile){
            return res.status(404).send({'message': 'profile not found'});
        }
        const updatedProfile = ProfileModel.update(req.params.id, req.body);
        return res.status(204).send(updatedProfile);
    },

    delete(req, res){
      const profile = ProfileModel.findOne(req.params.id);

      if(!profile){
          return res.status(404).send({'message': 'profile not found'});
      }

      const profil = ProfileModel.delete(req.params.id);
      return res.status(204).send(profil);
    }
};

export default Profile;
