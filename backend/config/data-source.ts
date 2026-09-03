import { DataSource } from "typeorm";

export const DataSourceConfig = new DataSource({
  type: "postgres",
  replication:{
    master:{
      port:Number(process.env.DB_MASTER_PORT)||5432,
      host:process.env.DB_MASTER_HOST||'localhost',
      username:process.env.DB_MASTER_USER||'postgres',
      password:process.env.DB_MASTER_PASS|| undefined,
      database:process.env.DB_NAME|| undefined,
    },
    slaves:[
      {
        port:Number(process.env.DB_SLAVE1_PORT)||5433,
        host:process.env.DB_SLAVE1_HOST||'localhost',
        username:process.env.DB_SLAVE1_USER||'postgres',
        password:process.env.DB_SLAVE1_PASSWORD|| undefined,
      }
    ]
  },
  entities:['src/models/**/*.ts'],
  migrations:['src/migrations/**/*.ts'],
  synchronize:false,
  logging:true,
  ssl:process.env.NODE_ENV==='production' ? true : false,
  extra:{
    ssl:{
      rejectUnauthorized:false,
    }
  } 
})

