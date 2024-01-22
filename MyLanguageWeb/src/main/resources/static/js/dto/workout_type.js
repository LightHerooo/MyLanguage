export class WorkoutTypeResponseDTO {
    id;
    title;
    code;
    message;
    pathToImage;
    isActive;

    constructor(workoutTypeJson) {
        this.id = workoutTypeJson["id"];
        this.title = workoutTypeJson["title"];
        this.code = workoutTypeJson["code"];
        this.message = workoutTypeJson["message"];
        this.pathToImage = workoutTypeJson["path_to_image"];
        this.isActive = workoutTypeJson["is_active"];
    }
}