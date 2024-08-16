import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/sequelize';

interface TaskAttributes {
  id: number;
  title: string;
  description?: string; 
  status: 'Pending' | 'In Progress' | 'Completed'; 
  priority?: string;
  due_date?: Date; 
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date; // Optional field for soft delete
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'due_date' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public status!: 'Pending' | 'In Progress' | 'Completed';
  public due_date?: Date;
  public priority?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date; // Optional field for soft delete
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      defaultValue: 'Pending',
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: 'SET DEFAULT',
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: false,
  }
);

export default Task;
