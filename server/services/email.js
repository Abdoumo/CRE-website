import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoyer une alerte email lors de la soumission d'un projet
 * Envoyé à la Directrice du Centre (Bouslama Zahida) et au Directeur de l'Incubateur
 */
export async function sendProjectAlert(project, user) {
  const projectTypeLabels = {
    machine_physique: 'Machine Physique',
    service_digital: 'Service Digital',
    application: 'Application',
    recherche: 'Projet de Recherche',
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8faf8; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #2d6a4f, #10b981); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🌿 CRE Annaba - Nouveau Projet Soumis</h1>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #2d6a4f; margin-top: 0;">${project.title}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666;">Porteur du projet</td><td style="padding: 8px 0; font-weight: bold;">${user.first_name} ${user.last_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${user.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Organisation</td><td style="padding: 8px 0;">${user.organization || 'Non spécifiée'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Type de projet</td><td style="padding: 8px 0;">${projectTypeLabels[project.project_type] || project.project_type}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Budget estimé</td><td style="padding: 8px 0;">${project.budget_estimate ? project.budget_estimate.toLocaleString('fr-DZ') + ' DZD' : 'Non spécifié'}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Taille d'équipe</td><td style="padding: 8px 0;">${project.team_size} personne(s)</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px;">
          <h3 style="color: #2d6a4f; margin-top: 0;">Description</h3>
          <p style="color: #333;">${project.description}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; font-size: 13px; color: #023e8a;">
          <strong>🏢 Avantage Infrastructure CRE :</strong> Hébergement à vie & messagerie professionnelle garantis pour tous les projets incubés.
        </div>
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://cre-annaba.dz/admin/projects" style="display: inline-block; padding: 12px 30px; background: #2d6a4f; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Voir dans le Dashboard
          </a>
        </div>
      </div>
      <div style="background: #2d6a4f; padding: 15px; text-align: center; color: rgba(255,255,255,0.7); font-size: 12px;">
        CRE Annaba - Centre de Recherche en Environnement | Plateforme d'Incubation
      </div>
    </div>
  `;

  const recipients = [process.env.DIRECTOR_EMAIL, process.env.INCUBATOR_EMAIL].filter(Boolean).join(', ');

  await transporter.sendMail({
    from: `"CRE Annaba - Plateforme" <${process.env.SMTP_USER}>`,
    to: recipients,
    subject: `[Nouveau Projet] ${project.title} - ${projectTypeLabels[project.project_type] || project.project_type}`,
    html: htmlContent,
  });

  console.log(`📧 Alerte email envoyée à: ${recipients}`);
}
