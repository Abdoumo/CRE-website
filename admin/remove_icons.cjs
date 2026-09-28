const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/pages/**/*.jsx', { cwd: __dirname });
for (const file of files) {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('lucide-react')) {
    content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?/g, '');
    
    // Replace <IconName size={16} ... /> with text or span
    content = content.replace(/<(Search|Filter|Mail|Calendar|MapPin|Users|Video|BookOpen|Award|TrendingUp|DollarSign|Plus|CheckCircle|XCircle|Eye|Clock|ExternalLink|Building|Briefcase)\s*([^>]*)\/?>/g, 
      (match, icon) => {
        // Since we are creating a premium typographic design without icons, we should use empty strings or clean text, 
        // but since they might be used inline, we can replace them with a simple text span or remove them.
        return `<span className="icon-replacement icon-${icon.toLowerCase()}"></span>`;
      }
    );
    
    fs.writeFileSync(fullPath, content);
    console.log('Updated ' + file);
  }
}
