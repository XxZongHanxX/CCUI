module.exports = function(sequelize, Sequelize) {
 
    var student = sequelize.define('student', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        Student_ID: Sequelize.INTEGER,
        Student_Name: Sequelize.STRING(10),
        Student_Department: Sequelize.STRING(10),
        Student_Grade: Sequelize.INTEGER,
        Student_Email: Sequelize.STRING(50),
        Student_Gender: Sequelize.STRING(1),
        Student_Identify_ID: Sequelize.STRING(10),
        Student_Birth: Sequelize.INTEGER,
        Student_Password: Sequelize.STRING(70),
        Student_Change: Sequelize.BOOLEAN,
        Student_Class: Sequelize.STRING(5)
    },{freezeTableName: true,
        timestamps: false});
 
    return student;
 
}