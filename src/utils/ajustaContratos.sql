SET SQL_SAFE_UPDATES = 0;

UPDATE contratos 
SET indice_reajuste = 0 
WHERE indice_reajuste is not null;