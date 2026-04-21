import pool from '../../config/db.js'
import bcrypt from 'bcrypt'

export const getOwnerById = async (id) => {
  try {
    const result = await pool.query(
      'SELECT id, name, username, email, created_at, subscription_plan, subscription_status, subscription_end_date FROM owners WHERE id = $1',
      [id]
    )
    if (!result.rows.length) throw new Error('Owner not found')

    const owner = result.rows[0];
    let trial_days_left = 0;
    
    if (owner.subscription_status === 'trial' && owner.subscription_end_date) {
      const now = new Date();
      const end = new Date(owner.subscription_end_date);
      const diffTime = end - now;
      trial_days_left = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (trial_days_left <= 0) {
        owner.subscription_status = 'expired';
        trial_days_left = 0;
        await pool.query("UPDATE owners SET subscription_status = 'expired' WHERE id = $1", [id]);
      }
    }
    
    owner.trial_days_left = trial_days_left;

    return owner;
  } catch (err) {
    throw err
  }
}

export const updateOwner = async (id, { name }) => {
    try {
      const result = await pool.query(
        'UPDATE owners SET name = $1 WHERE id = $2 RETURNING id, name, username, email',
        [name, id]
      )
      if (!result.rows.length) throw new Error('Owner not found')
      return result.rows[0]
    } catch (err) {
      throw err
    }
  }
export const updatePassword = async (id, { current_password, new_password }) => {
  try {
    const result = await pool.query(
      'SELECT password_hash FROM owners WHERE id = $1',
      [id]
    )
    if (!result.rows.length) throw new Error('Owner not found')

    const valid = await bcrypt.compare(current_password, result.rows[0].password_hash)
    if (!valid) throw new Error('Current password is incorrect')

    const hash = await bcrypt.hash(new_password, 10)
    await pool.query('UPDATE owners SET password_hash = $1, token_version = token_version + 1 WHERE id = $2', [hash, id])
  } catch (err) {
    throw err
  }
}

export const deleteAccount = async (id) => {
  try {
    const result = await pool.query('DELETE FROM owners WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) throw new Error('Owner not found');
  } catch (err) {
    throw err;
  }
}