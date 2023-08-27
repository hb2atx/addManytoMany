const express = require("express");

const app = express();
const ExpressError = require("./expressError")

const db = require("../db");
const { route, router } = require("../app");

app.use(express.json());

//RETURNS LIST OF COMPANIES
route.get("/companies", async (req, res, next) => {
    try{
        const results = await db.query(
            `SELECT code, name, description
            FROM companies`
        );
        return res.json(results.rows);
    } catch(e){
        return next(e);
    }
})

// RETURNS OBJ OF COMPANY
route.get("/companies/[code]", async (req, res, next) => {
    try{
        const { code } = req.params;
        const results = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code = $1` [code]);

       if (results.rows.length === 0) {
        throw new ExpressError(`Cant find company with the code of ${ code }`, 404)
       } 
       return res.send({ company: results.rows[0] })
    } catch (e) {

        return next(e);
    }
});

// ADDS A COMPANY
router.post("/companies", async (req, res, next) => {
    try{
        const { code, name, description } = req.body;

        const result = await db.query(
            `INSERT INTO companies
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );
    } catch(e) {
        return next(e);
    }
});

// EDIT EXISTING COMPANY
route.put("/companies/[code]", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;

        const results = await db.query(
            `UPDATE companies SET code =$1, name =$2, description =$3
            WHERE code = $4
            RETURNING code, name, description`,
            [name, description, req.params.code]
        );
        return res.json(results.rows[0]);
    } catch (e) {
        return next(e);
    }
});

// DELETE A COMPANY
route.delete("/companies/[code]", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;

        const result = await db.query(
            `DELETE FROM companies
            WHERE code = $1`,
            [req.params.code]
        );
        return res.json(result.rows[0]);
    } catch(e) {
        return next(e);
    }
});

module.exports = router;
   


