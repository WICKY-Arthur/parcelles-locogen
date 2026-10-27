export async function onRequestPost(context) {
  // context contient la requête (request) et tes variables secrètes (env)
  const { request, env } = context;

  try {
    const body = await request.json();
    
    // 1. Formater la liste des parcelles pour l'email
    const parcellesHtml = body.parcelles.map(p => 
      `<li>${p.commune} (Sect. ${p.section} - N°${p.numero}) — Surface: ${p.surface} m²</li>`
    ).join('');

    // 2. Préparer le contenu de l'email
    const emailContent = `
      <h2>Nouvelle demande de projet solaire Locogen</h2>
      <p><strong>Contact :</strong> ${body.contact.prenom} ${body.contact.nom}</p>
      <p><strong>Email :</strong> ${body.contact.email}</p>
      <p><strong>Téléphone :</strong> ${body.contact.tel || 'Non renseigné'}</p>
      <p><strong>Rôle :</strong> ${body.contact.role || 'Non renseigné'}</p>
      <p><strong>Message :</strong> ${body.contact.message || 'Aucun message'}</p>
      
      <h3>Parcelles sélectionnées (${body.parcelles.length})</h3>
      <ul>${parcellesHtml}</ul>
    `;

    // 3. Envoyer l'email via l'API Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Locogen <onboarding@resend.dev>', // Ne change pas ça tant que tu n'as pas de nom de domaine payant validé sur Resend
        to: 'ton_adresse@gmail.com',             // ⚠️ METS TON ADRESSE EMAIL ICI
        subject: `☀️ Nouveau Lead Solaire - ${body.contact.prenom} ${body.contact.nom}`,
        html: emailContent
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Erreur Resend:", errorText);
      return new Response(JSON.stringify({ error: 'Erreur Email' }), { status: 500 });
    }

    // Succès !
    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}