import { Model, DataTypes } from 'sequelize';
import sequelize  from '../database/sequelize';

export class TaskHistory extends Model {
    public id!: number;
    public task_id!: number;
    public field_name!: string;
    public old_value!: string | Date | null;
    public new_value!: string | Date | null;
    public action!: string;
    public changed_by!: string;
}

TaskHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    field_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    old_value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    new_value: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    changed_by: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'taskhistories',
    timestamps: false
});
