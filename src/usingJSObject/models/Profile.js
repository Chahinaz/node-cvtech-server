import moment from 'moment';
import uuid from 'uuid';

class Profile{
    constructor(){
        this.profiles = [];
    }

    create(data){
        const newProfile = {
            id: uuid.v4(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            createdDate: moment.now(),
            modifiedDate: moment.now()
        };

        this.profiles.push(newProfile);
        return newProfile;
    }

    findOne(id){
        return this.profiles.find(reflect => reflect.id === id);
    }

    findAll(){
        return this.profiles;
    }

    update(id, data){
        const profile = this.findOne(id);
        const i = this.profiles.indexOf(profile);

        this.profiles[i].firstName = data['firstName'] || profile.firstName;
        this.profiles[i].lastName = data['lastName'] || profile.lastName;
        this.profiles[i].email = data['email'] || profile.email;
        this.profiles[i].description = data['description'] || profile.description;
        this.profiles[i].skills = data['skills'] || profile.skills;
        this.profiles[i].sector = data['sector'] || profile.sector;

        return this.profiles[i];
    }

    delete(id){
        const profile = this.findOne(id);
        const i = this.profiles.indexOf(profile);

        this.profiles.splice(i, 1);
        return {};
    }
}

export default new Profile;
